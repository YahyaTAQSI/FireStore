const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const bodyParser = require("body-parser");

const cors = require("cors");
const stripe = require("stripe")(
  "sk_test_51J6Ny7LReiWo9Nx31va9ZatBF7lfnRCm997b7v60VqxS01yWEevz0vn68DHeagem317y2E62uRXW1Jacn3FBYzws00r0jauWlY"
);
const endpointSecret = "whsec_GgdSaeF0XA4KIA7AtAeuXqRPBTu6WeHW";

const serviceAccount = require("./permissions.json");
const firebaseApp = !admin.apps.length
  ? admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    })
  : admin.firebaseApp();

// ! api

// ! app config
const app = express();
// ! middlewares
app.use(cors({ origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// ! api routes
// * for testing

app.get("/", (req, res) => res.status(200).send("Hello World"));

app.post("/payments/create", async (req, res) => {
  const { items, email } = req.body;
  const transformItems = items.map((item) => ({
    description: item.description,
    quantity: 1,
    price_data: {
      currency: "usd",
      unit_amount: item.price * 100,
      product_data: {
        name: item.title,
        images: [item.image],
      },
    },
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    shipping_rates: ["shr_1J6O2MLReiWo9Nx3DewLGHLz"],
    shipping_address_collection: {
      allowed_countries: ["US", "GB", "MA"],
    },
    line_items: transformItems,
    mode: "payment",
    success_url: "https://clone-903bd.web.app/orders",
    cancel_url: "https://clone-903bd.web.app/checkout",
    metadata: {
      email,
      images: JSON.stringify(items.map((item) => item.image)),
    },
  });
  res.status(200).json({ id: session.id });
});

const fulfillOrder = async (session) => {
  return firebaseApp
    .firestore()
    .collection("user")
    .doc(session.metadata.email)
    .collection("orders")
    .doc(session.id)
    .set({
      id: session.payment_intent,
      amount: session.amount_total / 100,
      amount_shipping: session.total_details.amount_shipping / 100,
      images: JSON.parse(session.metadata.images),
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    })
    .then(() =>
      console.log(`Success: order ${session.id} has been added to the DB`)
    );
};
app.post("/webhook", async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;
  //! verify the event
  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
    console.log("eventttt>>>", event);
  } catch (error) {
    console.log("errro", error.message);
    return res.status(400).send(`Webhook erroe : ${error.message}`);
  }
  //! handle the checkout.session.completed

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    console.log("session>>>", session.metadata.email);
    return fulfillOrder(session)
      .then(() => res.status(200))
      .catch((err) => res.status(400).send(`webhook error: ${err.message}`));
  }
});

// ! listen command

exports.api = functions.https.onRequest(app);
