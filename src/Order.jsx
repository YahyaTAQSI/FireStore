import "./Order.css";
import moment from "moment";
import CheckoutProduct from "./CheckoutProduct";
import CurrencyFormat from "react-currency-format";

export default function Order({ order }) {
  return (
    <div className="order">
      <p className="order__id">
        <small>{order.id}</small>
      </p>
      <h2>Order</h2>
      <p>{moment.unix(order.data.created).format("MMMM Do YYYY, h:mma")}</p>

      <div className="orderedProductsContainer">
        {order.data.basket?.map((item) => (
          <div key={item.id} className="orderedProducts">
            <img
              className="orderedProductsImg"
              src={item.image}
              alt={item.title}
            />
            <h4 className="orderedProductsTitle">{item.title}</h4>
            <h5 className="orderedProductsPrice">{item.price}</h5>
          </div>
        ))}
      </div>
      <CurrencyFormat
        renderText={(value) => (
          <h3 className="order__total">Order Total : {value}</h3>
        )}
        decimalScale={2}
        value={order.data.amount / 100}
        displayType={"text"}
        thousandsSeparator={true}
        prefix={"$"}
      />
    </div>
  );
}
