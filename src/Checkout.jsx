import { Button, Paper } from "@material-ui/core";
import "./Checkout.css";
import CheckoutProduct from "./CheckoutProduct";
import { useStateValue } from "./StateProvider";
import Subtotal from "./Subtotal";
import empty from "./logos/empty.png";
import { Link, useHistory } from "react-router-dom";

export default function Checkout() {
  const [{ basket, user }, dispatch] = useStateValue();

  return (
    <div className="checkout">
      <div className="checkout__left">
        <img
          src="https://fortheloveblog.com/wp-content/uploads/2016/07/Amazon-Prime-Banner.jpg"
          alt="ads"
          className="checkout__ad"
        />
        <div className="checkout__middle">
          <Paper className="hello" elevation={10}>
            <h3>Hello, {user ? user?.displayName : "Gest"}</h3>
            <h2 className="checkout__title">
              your shopping basket
              {basket.length <= 0 && " is currently Empty"}
            </h2>
          </Paper>

          {basket.length <= 0 && (
            <div className="emptyCheckout">
              <img className="emptyCheckoutImg" src={empty} alt="" />
              <Button component={Link} to="" className="emptyCheckoutButton">
                Shop Now
              </Button>
            </div>
          )}

          <div className="shopping__basket">
            {basket.map((item) => (
              <CheckoutProduct
                id={item.id}
                title={item.title}
                image={item.image}
                price={item.price}
                rating={item.rating}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="checkout__right">
        <Subtotal />
      </div>
    </div>
  );
}
