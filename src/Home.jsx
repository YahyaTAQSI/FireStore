import { useState, useEffect } from "react";
import "./Home.css";
import { Pagination } from "@material-ui/lab";
import { Search } from "@material-ui/icons";
import { db, storage } from "./firebase";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Autocomplete from "@material-ui/lab/Autocomplete";

import styled from "styled-components";

import Product from "./Product";
import ProductsSlider from "./ProductsSlider";
import ProductLoading from "./ProductLoading";
import ProductSliderLoading from "./ProductSliderLoading";
import { Button, ButtonGroup, Input, TextField } from "@material-ui/core";

export default function Home() {
  const [allNewProducts, setAllNewProducts] = useState([]);
  const [productsCategory, setProductsCategory] = useState("");
  const [products, setProducts] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const results = products.filter((o) =>
      o.title?.toLowerCase().includes(searchTerm?.toLowerCase())
    );
    setSearchResults(results);
  }, [searchTerm]);

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

  const [loading, setLoading] = useState(true);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const getAllProducts = async () => {
    setLoading(true);
    const URL = !productsCategory
      ? "https://fakestoreapi.com/products"
      : `https://fakestoreapi.com/products/category/${productsCategory}`;
    await fetch(URL)
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
      });

    setLoading(false);
  };

  useEffect(() => {
    getAllProducts();
  }, [productsCategory]);

  useEffect(() => {
    if (allProducts.length > 0 || products.length > 0) {
      setAllNewProducts([...allProducts, ...products]);
    }
  }, [products, allProducts]);

  const [pageNumber, setPageNumber] = useState(1);
  const productPerPage = 6;
  const pagesVisited = pageNumber * productPerPage - 6;

  const twoArrays = searchResults.length > 0 ? searchResults : allNewProducts;

  const displayProducts = twoArrays.slice(
    pagesVisited,
    pagesVisited + productPerPage
  );

  const pageCount = Math.ceil(twoArrays.length / productPerPage);

  const handleChange = (event, value) => {
    setPageNumber(value);
  };

  let settings = {
    dots: false,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    arrows: false,
  };

  return (
    <Container>
      <div className="products__header">
        <ButtonGroup
          variant="contained"
          aria-label="contained primary button group"
        >
          <Button
            className={
              !productsCategory ? "group__Buttons selected" : "group__Buttons"
            }
            onClick={() => {
              setProductsCategory("");
              scrollToTop();
            }}
          >
            All
          </Button>

          <Button
            className={
              productsCategory === "men's clothing"
                ? "group__Buttons selected"
                : "group__Buttons"
            }
            onClick={() => {
              setProductsCategory("men's clothing");
              scrollToTop();
            }}
          >
            men's clothing
          </Button>
          <Button
            className={
              productsCategory === "women's clothing"
                ? "group__Buttons selected"
                : "group__Buttons"
            }
            onClick={() => {
              setProductsCategory("women's clothing");
              scrollToTop();
            }}
          >
            women's clothing
          </Button>
          <Button
            className={
              productsCategory === "jewelery"
                ? "group__Buttons selected"
                : "group__Buttons"
            }
            onClick={() => {
              setProductsCategory("jewelery");
              scrollToTop();
            }}
          >
            jewelery
          </Button>
          <Button
            className={
              productsCategory === "electronics"
                ? "group__Buttons selected"
                : "group__Buttons"
            }
            onClick={() => {
              setProductsCategory("electronics");
              scrollToTop();
            }}
          >
            electronics
          </Button>
        </ButtonGroup>

        <Autocomplete
          freeSolo
          id="free-solo-2-demo"
          value={searchTerm}
          onChange={(event, newValue) => {
            setSearchTerm(newValue);
          }}
          options={products.map((option) => option.title)}
          renderInput={(params) => (
            <TextField
              {...params}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
              placeholder="Search"
              variant="outlined"
              InputProps={{
                ...params.InputProps,
                type: "text",
                className: "input_field_input",
                value: searchTerm,
              }}
            />
          )}
        />
      </div>

      <Carousel {...settings}>
        {loading ? (
          <ProductSliderLoading />
        ) : (
          products
            .slice(0, 5)
            .map((product) => (
              <ProductsSlider
                key={product.id}
                id={product.id}
                title={product.title}
                price={product.price}
                category={product.category}
                description={product.description}
                image={product.image}
              />
            ))
        )}
      </Carousel>

      <div className="products__pagination">
        <div className="home__row">
          {loading ? (
            <div>
              {Array(6)
                .fill()
                .map((item) => (
                  <ProductLoading />
                ))}
            </div>
          ) : (
            <div>
              {displayProducts.map((product) => (
                <Product
                  key={product.id}
                  id={product.id}
                  title={product.title}
                  price={product.price}
                  category={product.category}
                  description={product.description}
                  image={product.image}
                />
              ))}
            </div>
          )}
        </div>

        <PaginationContainer
          showFirstButton
          showLastButton
          variant="outlined"
          count={pageCount}
          onChange={handleChange}
          onClick={scrollToTop}
        />
      </div>
    </Container>
  );
}
const PaginationContainer = styled(Pagination)`
  margin-top: 50px !important;
  button {
    color: white;
    background-color: #131921;
    :hover {
      color: #131921;
      background-color: white;
    }
  }
  .Mui-selected {
    color: #fff !important;
    background-color: #ee433d !important;
  }
`;

const Container = styled.main`
  width: 100%;
  padding: 10px 0;
`;

const Carousel = styled(Slider)`
  margin-top: 50px;
  background: #d6d6d6;
  @media (max-width: 660px) {
    margin-top: 85px;
  }
`;
