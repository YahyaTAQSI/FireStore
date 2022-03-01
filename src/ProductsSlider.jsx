import { IconButton, Button } from "@material-ui/core";
import "./Slider.css";
import styled from "styled-components";
import { useState } from "react";
import { useStateValue } from "./StateProvider";

export default function ProductsSlider({
  id,
  title,
  price,
  description,
  image,
  category,
}) {
  const [quantity, setQuantity] = useState(1);
  const [{ basket }, dispatch] = useStateValue();
  const addToBasket = () => {
    Array(quantity)
      .fill()
      .map((el) =>
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
        })
      );
  };
  return (
    <div className="page">
      <div className="card">
        <div className="cardInfo">
          <div className="text-container">
            <h3>{title}</h3>
            <p>{description}</p>
          </div>
          <div className="cart-container">
            <div className="quantity-controls">
              <AddOrButton
                onClick={() => setQuantity(quantity === 1 ? 1 : quantity - 1)}
              >
                -{" "}
              </AddOrButton>

              <span id="quantity">{quantity}</span>
              <AddOrButton onClick={() => setQuantity(quantity + 1)}>
                +{" "}
              </AddOrButton>
            </div>

            <Button onClick={addToBasket} className="add_to_cart">
              Add to cart
            </Button>
          </div>
        </div>
        <div className="cardImg">
          <strong>${price}</strong>
          <div className="img-container">
            <img src={image} alt="jjjj" />
          </div>
        </div>
      </div>
    </div>
  );
}

const AddOrButton = styled(IconButton)`
  color: #131921 !important;

  width: 30px;
  height: 30px;
  box-shadow: 2px 2px 10px #5e5f5f, -2px -2px 20px #ffffff;
  :hover {
    color: #fff !important;

    background-color: #131921 !important;
  }
`;
