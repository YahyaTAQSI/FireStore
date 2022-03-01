import { Button } from "@material-ui/core";
import "./CheckoutProduct.css";
import { useStateValue } from "./StateProvider";

export default function CheckoutProduct({
  id,
  title,
  image,
  price,
  rating,
  hideButton,
}) {
  const [{ basket }, dispatch] = useStateValue();

  const removeFromBasket = () => {
    dispatch({
      type: "REMOVE_FROM_BASKET",
      id: id,
    });
  };
  return (
    <div className="checkoutproduct">
      <img src={image} alt="product" className="checkoutproduct__image" />
      <div className="checkoutproduct__info">
        <p className="checkoutproduct__title">{title}</p>
      </div>
      <div className="info__container">
        {!hideButton && (
          <Button onClick={removeFromBasket}>Remove from Basket</Button>
        )}
        <p className="checkoutproduct__price">
          <small>$</small>
          <strong>{price}</strong>
        </p>
      </div>
    </div>
  );
}
