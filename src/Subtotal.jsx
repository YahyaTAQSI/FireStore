import "./Subtotal.css";
import CurrencyFormat from "react-currency-format";
import { useStateValue } from "./StateProvider";
import { getBasketTotal } from "./reducer";
import { useHistory } from "react-router-dom";
import { Button, Paper } from "@material-ui/core";
import styled from "styled-components";
import CircularProgress from "@material-ui/core/CircularProgress";

import { loadStripe } from "@stripe/stripe-js";
import axios from "./axios";
import { useState } from "react";

const stripePromise = loadStripe(
  "pk_test_51J6Ny7LReiWo9Nx36Ahi0xjNrrlb9JiRE4kEkUETz9j4REy26sBMXS5y9yqm0CcdSQW7z9krYv504fDSu3PxUovH00iPRvQkPQ"
);

export default function Subtotal() {
  const [loading, setLoading] = useState(false);

  const [{ basket, user }, dispatch] = useStateValue();
  const history = useHistory();

  const createCheckoutSessions = async () => {
    setLoading(true);
    const stripe = await stripePromise;
    const checkoutSession = await axios.post("/payments/create", {
      items: basket,
      email: user.email,
    });

    //? redirect user to checkout
    const result = await stripe.redirectToCheckout({
      sessionId: checkoutSession.data.id,
    });

    setLoading(true);

    if (result.error) alert(result.error.message);
  };

  return (
    <Paper elevation={10} className="subtotal">
      <CurrencyFormat
        renderText={(value) => (
          <>
            <p>
              Subtotal ({basket.length} items) :<strong> {value}</strong>
            </p>
            <small className="subtotal__gift">
              <input type="checkbox" />
              This order contains a gift
            </small>
          </>
        )}
        decimalScale={2}
        value={getBasketTotal(basket)}
        displayType={"text"}
        thousandsSeparator={true}
        prefix={"$"}
      />
      <div className="centredButton">
        <Button
          disabled={basket.length <= 0}
          role="link"
          endIcon={loading && <CircularProgress size={20} color="secondary" />}
          className="proceed__Button"
          onClick={user ? createCheckoutSessions : () => history.push("/login")}
        >
          Proceed to Checkout
        </Button>
      </div>
    </Paper>
  );
}
