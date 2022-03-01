import "./Product.css";
import { useStateValue } from "./StateProvider";
import Paper from "@material-ui/core/Paper";

import Tilt from "react-parallax-tilt";
import { Button } from "@material-ui/core";

export default function Product({
  id,
  title,
  price,
  category,
  description,
  image,
}) {
  const [{ basket }, dispatch] = useStateValue();
  const addToBasket = () => {
    dispatch({
      type: "ADD_TO_BASKET",
      item: {
        id: id,
        title: title,
        image: image,
        price: price,
        category: category,
        description: description,
      },
    });
  };
  return (
    <Paper component={Tilt} className="product" elevation={10}>
      <div>
        <img src={image} alt="product" className="productImg" />

        <div className="product__info">
          <p>{title}</p>
        </div>
      </div>
      <div className="info__container">
        <Button onClick={addToBasket}>Add to Cart</Button>
        <p className="product__price">
          <small>$</small>
          <strong>{price}</strong>
        </p>
      </div>
    </Paper>
  );
}
