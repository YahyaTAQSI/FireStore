import "./Product.css";
import Paper from "@material-ui/core/Paper";
import React from "react";

import Tilt from "react-parallax-tilt";
import { Button } from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";

export default function ProductLoading() {
  return (
    <Paper className="product" elevation={10}>
      <Skeleton animation="wave" width="100%" height={200} />

      <div className="product__info">
        <React.Fragment>
          <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
          <Skeleton animation="wave" height={10} width="80%" />
        </React.Fragment>
      </div>
      <div className="info__container">
        <Skeleton animation="wave" height={50} width="50%" />

        <Skeleton animation="wave" height={10} width="30%" />
      </div>
    </Paper>
  );
}
