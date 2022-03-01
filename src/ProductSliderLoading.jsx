import "./Slider.css";
import React from "react";
import Skeleton from "@material-ui/lab/Skeleton";
import { Button } from "@material-ui/core";
export default function ProductSliderLoading() {
  return (
    <div className="page">
      <div className="card">
        <div className="cardInfo">
          <div className="text-container">
            <Skeleton component="h3" width="100%" animation="wave" />
            <Skeleton component="p" width="70%" animation="wave" />
            <Skeleton component="p" width="70%" animation="wave" />
            <Skeleton component="p" width="70%" animation="wave" />
          </div>
          <div className="cart-container">
            <div className="quantity-controls">
              <Skeleton
                animation="wave"
                variant="circle"
                width={40}
                height={40}
              />
              <Skeleton animation="wave">
                <strong>Quantity</strong>
              </Skeleton>
              <Skeleton
                animation="wave"
                variant="circle"
                width={40}
                height={40}
              />
            </div>
            <Skeleton animation="wave" width="10%">
              <span id="quantity"></span>
            </Skeleton>
            <Skeleton
              animation="wave"
              component={Button}
              width="50%"
              height="100%"
            />
          </div>
        </div>
        <div className="cardImg">
          <Skeleton
            animation="wave"
            component="strong"
            width="20%"
            style={{
              marginTop: 10,
              marginRight: 20,
            }}
          />

          <div className="img-container">
            <Skeleton animation="wave" width="100%" height="100%">
              <img alt="jjjj" />
            </Skeleton>
          </div>
        </div>
      </div>
    </div>
  );
}
