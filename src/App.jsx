import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { db, auth } from "./firebase";
import { useStateValue } from "./StateProvider";

import "./App.css";
import Footer from "./Footer";

import Checkout from "./Checkout";
import Header from "./Header";
import Home from "./Home";
import Login from "./Login";
import Orders from "./Orders";
import UserProfile from "./UserProfile";
import Loading from "./Loading";
import AddProducts from "./AddProducts";

function App() {
  const [{ basket, user }, dispatch] = useStateValue();

  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //* the user hut logged in / the user was logged in
        dispatch({
          type: "SET_USER",
          user: authUser,
        });
      } else {
        //* the user logged out
        dispatch({
          type: "SET_USER",
          user: null,
        });
      }
    });
  }, []);

  useEffect(() => {
    getLocalBasket();
  }, []);

  useEffect(() => {
    saveLocalBasket();
  }, [basket]);

  const saveLocalBasket = () => {
    localStorage.setItem("basket", JSON.stringify(basket));
  };
  const getLocalBasket = () => {
    if (localStorage.getItem("basket") === null) {
      localStorage.setItem("basket", JSON.stringify([]));
    } else {
      let basketLocal = JSON.parse(localStorage.getItem("basket"));
      basketLocal.map((el) =>
        dispatch({
          type: "ADD_TO_BASKET",
          item: {
            id: el.id,
            title: el.title,
            image: el.image,
            price: el.price,
            category: el.category,
            description: el.description,
          },
        })
      );
    }
  };

  return (
    <Router>
      {auth.currentUser ? (
        <Switch>
          {auth.currentUser.email === "ysimo44@gmail.com" && (
            <Route exact path="/products">
              <Header />
              <AddProducts />
            </Route>
          )}

          <Route exact path="/profile">
            <Header />
            <UserProfile />
          </Route>

          <Route exact path="/orders">
            <Header />
            <Orders />
          </Route>

          <Route exact path="/checkout">
            <Header />
            <Checkout />
          </Route>

          <Route exact path="/">
            <Header />
            <Home />
            <Footer />
          </Route>
        </Switch>
      ) : (
        <Switch>
          <Route exact path="/login">
            <Login />
          </Route>

          <Route exact path="/checkout">
            <Header />
            <Checkout />
          </Route>

          <Route exact path="/">
            <Header />
            <Home />
            <Footer />
          </Route>
        </Switch>
      )}
    </Router>
  );
}

export default App;
