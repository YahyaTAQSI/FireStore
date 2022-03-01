import { Button, IconButton } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { Rating } from "@material-ui/lab";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import CreateIcon from "@material-ui/icons/Create";
import AutorenewIcon from "@material-ui/icons/Autorenew";
import ClearIcon from "@material-ui/icons/Clear";
import { db, storage } from "./firebase";
import CurrencyFormat from "react-currency-format";

import "./AddedProducts.css";
import { useEffect, useState } from "react";
export default function AddedProducts({
  p_id,
  p_title,
  p_description,
  p_category,
  p_price,
  p_rating,
  p_quantity,
  p_image,
}) {
  const [titleAdded, setTitleAdded] = useState(p_title);
  const [descriptionAdded, setDescriptionAdded] = useState(p_description);
  const [categoryAdded, setCategoryAdded] = useState(p_category);
  const [priceAdded, setPriceAdded] = useState(p_price);
  const [ratingAdded, setRatingAdded] = useState(p_rating);
  const [quantityAdded, setQuantityAdded] = useState(p_quantity);
  const [imageAdded, setImageAdded] = useState(p_image);
  const [fileAdded, setFileAdded] = useState({});
  const [prmition, setPrmition] = useState(false);

  useEffect(() => {
    !prmition && setTitleAdded(p_title);
    setDescriptionAdded(p_description);
    setCategoryAdded(p_category);
    setPriceAdded(p_price);
    setRatingAdded(p_rating);
    setQuantityAdded(p_quantity);
    setImageAdded(p_image);
  }, [prmition]);

  const updateProducts = (e) => {
    e.preventDefault();

    if (fileAdded.length >= 0) {
      storage
        .ref()
        .child(`products/${p_id}/products.jpg`)
        .delete()
        .then(() => {
          storage
            .ref(`products/${p_id}/product.jpg`)
            .put(fileAdded)
            .then((photoupdated) => {
              storage
                .ref(`products/${p_id}/product.jpg`)
                .getDownloadURL()
                .then((imgURL) => {
                  db.collection("Products")
                    .doc(p_id)
                    .update({
                      category: categoryAdded,
                      description: descriptionAdded,
                      image: imgURL,
                      price: priceAdded,
                      quantity: quantityAdded,
                      rating: ratingAdded,
                      title: titleAdded,
                    })
                    .then(function () {
                      console.log("Frank food updated");
                    });
                });
            });
        })
        .catch((error) => {
          console.log("zebi>>>>", error.message);
        });
    } else {
      db.collection("Products")
        .doc(p_id)
        .update({
          category: categoryAdded,
          description: descriptionAdded,
          image: imageAdded,
          price: priceAdded,
          quantity: quantityAdded,
          rating: ratingAdded,
          title: titleAdded,
        })
        .then(function () {
          setPrmition(false);
        })
        .catch((error) => {
          console.log("zebi tani>>>>", error.message);
        });
    }
  };

  const deleteFile = () => {
    db.collection("Products")
      .doc(p_id)
      .delete()
      .then(() => {
        storage
          .ref()
          .child(`products/${p_id}/product.jpg`)
          .delete()
          .then(() => {
            console.error(" deleted successfully");
          })
          .catch((error) => {
            console.error("Error removing photo: ", error);
          });
      })
      .catch((error) => {
        console.error("Error removing document: ", error);
      });
  };

  const uploadImageAdded = (e) => {
    if (e.target.files[0]) {
      setImageAdded("");
      setFileAdded({});
      setImageAdded(URL.createObjectURL(e.target.files[0]));
      setFileAdded(e.target.files[0]);
    }
  };
  return (
    <form onSubmit={updateProducts} className="Product__container">
      <IconButton
        onClick={() => setPrmition(!prmition)}
        className="permition"
        color="primary"
      >
        {!prmition ? <CreateIcon /> : <ClearIcon />}
      </IconButton>
      <div className="leftSide">
        <input
          required
          className={!prmition ? "inputs" : "granted inputs"}
          type="number"
          min="0"
          readOnly={!prmition}
          placeholder="Quantity"
          onChange={(e) => setQuantityAdded(e.target.value)}
          value={quantityAdded}
        />
        <textarea
          className={!prmition ? "inputs" : "granted inputs"}
          readOnly={!prmition}
          cols="30"
          rows="10"
          style={{ resize: "none" }}
          placeholder="Description"
          onChange={(e) => setDescriptionAdded(e.target.value)}
          value={descriptionAdded}
        ></textarea>
        <div className="productQuantity">
          <Rating
            required
            readOnly={!prmition}
            name="customized-empty"
            value={ratingAdded}
            onChange={(event, newValue) => {
              setRatingAdded(newValue);
            }}
            precision={0.5}
            emptyIcon={<StarBorderIcon fontSize="inherit" />}
          />

          <div className="updateOrRemove">
            <Button disabled={!prmition} type="submit" color="primary">
              Update
            </Button>
            <Button disabled={!prmition} color="secondary" onClick={deleteFile}>
              Remove
            </Button>
          </div>
        </div>
      </div>
      <div className="rightSide">
        <input
          required
          id="productPrice"
          className={
            !prmition ? "inputs inputCurrency" : "inputs inputCurrency granted"
          }
          type="number"
          readOnly={!prmition}
          placeholder="Price"
          onChange={(e) => setPriceAdded(e.target.value)}
          value={priceAdded}
          step="0.01"
          min="0"
        />
        <div className="updatedImgConatiner">
          <div className="NewImageCOnatainer">
            <img
              className={!prmition ? "rightSideImg" : "rightSideImg imgFocused"}
              src={imageAdded}
              alt=""
            />

            <input
              accept="image/*"
              id="productPhoto"
              type="file"
              onChange={uploadImageAdded}
            />
          </div>
          {prmition ? (
            <label htmlFor="productPhoto">
              <IconButton component="span" className="renew">
                <AutorenewIcon />
              </IconButton>
            </label>
          ) : (
            ""
          )}
        </div>

        <input
          required
          className={!prmition ? "inputs" : "granted inputs"}
          type="text"
          readOnly={!prmition}
          placeholder="Title"
          onChange={(e) => setTitleAdded(e.target.value)}
          value={titleAdded}
        />

        <input
          required
          className={!prmition ? "inputs" : "inputs granted"}
          type="text"
          placeholder="Category"
          readOnly={!prmition}
          onChange={(e) => setCategoryAdded(e.target.value)}
          value={categoryAdded}
        />
      </div>
    </form>
  );
}
