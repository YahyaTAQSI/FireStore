import { useEffect, useState } from "react";
import { db } from "./firebase";
import { useStateValue } from "./StateProvider";
import moment from "moment";
import CurrencyFormat from "react-currency-format";

import "./Orders.css";
import Order from "./Order";
export default function Orders() {
  const [{ basket, user }, dispatch] = useStateValue();

  const [newOrders, setewwOrders] = useState([]);

  useEffect(() => {
    if (user) {
      db.collection("user")
        .doc(user?.email)
        .collection("orders")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) =>
          setewwOrders(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }))
          )
        );
    } else {
      setewwOrders([]);
    }
  }, [user]);

  return (
    <div className="orders">
      <h1>{newOrders.length > 0 ? "Your orders" : "There is no Orders"}</h1>
      <div className="orders__order">
        {newOrders?.map((order) => (
          <div className="newOrders__Container">
            <p className="order__ID">{order.data.id}</p>
            <h2>Order</h2>
            <p>
              {moment
                .unix(order.data.timestamp.seconds)
                .format("MMMM Do YYYY, h:mma")}
            </p>
            <div className="orderedProductImgs">
              {order.data.images.map((image) => (
                <img src={image} alt="" />
              ))}
            </div>

            <CurrencyFormat
              renderText={(value) => (
                <h3 className="order__total">Order Total : {value}</h3>
              )}
              decimalScale={2}
              value={order.data.amount}
              displayType={"text"}
              thousandsSeparator={true}
              prefix={"$"}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
