import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { useEffect, useState } from "react";
import { db, storage } from "./firebase";
import "./AddProducts.css";
import Lottie from "react-lottie";

import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import { IconButton } from "@material-ui/core";
import AddedProducts from "./AddedProducts";
import * as Adding from "./addingProduct.json";

export default function AddProducts() {
  const [allProducts, setAllProducts] = useState([]);
  useEffect(() => {
    db.collection("Products").onSnapshot((snapshot) => {
      setAllProducts(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title,
          description: doc.data().description,
          category: doc.data().category,
          price: doc.data().price,
          rating: doc.data().rating,
          quantity: doc.data().quantity,
          image: doc.data().image,
        }))
      );
    });
  }, []);

  const [titleAdd, setTitleAdd] = useState("");
  const [descriptionAdd, setDescriptionAdd] = useState("");
  const [categoryAdd, setCategoryAdd] = useState("");
  const [priceAdd, setPriceAdd] = useState();
  const [ratingAdd, setRatingAdd] = useState();
  const [quantityAdd, setQuantityAdd] = useState();
  const [imageAdd, setImageAdd] = useState("");
  const [fileAdd, setFileAdd] = useState({});

  const uploadImg = (e) => {
    if (e.target.files[0]) {
      setImageAdd("");
      setFileAdd({});
      setImageAdd(URL.createObjectURL(e.target.files[0]));
      setFileAdd(e.target.files[0]);
    }
  };

  const addProduct = (e) => {
    e.preventDefault();
    if (fileAdd) {
      db.collection("Products")
        .add({
          title: titleAdd,
          description: descriptionAdd,
          category: categoryAdd,
          price: priceAdd,
          rating: ratingAdd,
          quantity: quantityAdd,
        })
        .then((docRef) => {
          storage
            .ref(`products/${docRef.id}/product.jpg`)
            .put(fileAdd)
            .then((photoupdated) => {
              storage
                .ref(`products/${docRef.id}/product.jpg`)
                .getDownloadURL()
                .then((imgURL) => {
                  db.collection("Products").doc(docRef.id).set(
                    {
                      image: imgURL,
                    },
                    { merge: true }
                  );
                  setTitleAdd("");
                  setDescriptionAdd("");
                  setCategoryAdd("");
                  setPriceAdd("");
                  setRatingAdd("");
                  setQuantityAdd("");
                  setImageAdd("");
                  setFileAdd({});
                });
            });
        });
    }
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: Adding.default,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="conatainer">
      <div className="paperConatainer">
        <form className="modal__form" onSubmit={addProduct}>
          <div className="form__container">
            <div className="img__container">
              <div className="addProductImg">
                <label htmlFor="product__photo">
                  {imageAdd ? (
                    <img
                      src={imageAdd}
                      alt="Product Img"
                      className="product__img"
                    />
                  ) : (
                    <IconButton className="product__img" component="span">
                      <AddAPhotoIcon />
                    </IconButton>
                  )}
                </label>

                <input
                  required
                  className="product__Fileimg"
                  accept="image/*"
                  id="product__photo"
                  type="file"
                  onChange={uploadImg}
                />
              </div>
              <input
                className="container__input"
                value={titleAdd}
                onChange={(e) => setTitleAdd(e.target.value)}
                required
                placeholder="Title"
                type="text"
              />
              <input
                className="container__input"
                value={categoryAdd}
                onChange={(e) => setCategoryAdd(e.target.value)}
                required
                placeholder="Category"
                type="text"
              />
              <input
                className="container__input"
                value={priceAdd}
                onChange={(e) => setPriceAdd(e.target.value)}
                required
                placeholder="Price"
                type="number"
                step="0.01"
              />
            </div>
            <div className="input__container">
              <textarea
                className="container__textarea"
                onChange={(e) => setDescriptionAdd(e.target.value)}
                cols="30"
                rows="10"
                style={{ resize: "none" }}
                placeholder="Description"
                value={descriptionAdd}
              ></textarea>

              <input
                className="container__input"
                value={ratingAdd}
                onChange={(e) => setRatingAdd(e.target.value)}
                required
                placeholder="Rating"
                type="number"
                step="0.5"
                max="5"
              />
              <input
                className="container__input"
                value={quantityAdd}
                onChange={(e) => setQuantityAdd(e.target.value)}
                required
                placeholder="Quantity"
                type="number"
              />
              <button type="submit" className="submitButton">
                Add Product
              </button>
            </div>
          </div>
        </form>

        {/* <Lottie options={defaultOptions} width="50%" /> */}
      </div>

      <div className="newProducts">
        {allProducts.map((product) => (
          <AddedProducts
            key={product.id}
            p_id={product.id}
            p_title={product.title}
            p_description={product.description}
            p_category={product.category}
            p_price={product.price}
            p_rating={product.rating}
            p_quantity={product.quantity}
            p_image={product.image}
          />
        ))}
      </div>
    </div>
  );
}
