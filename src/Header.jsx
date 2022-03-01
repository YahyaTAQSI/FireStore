import { Link, useHistory } from "react-router-dom";
import { useStateValue } from "./StateProvider";
import { db, auth } from "./firebase";
import Icon from "@material-ui/core/Icon";
import ShoppingCarOutlinedtIcon from "@material-ui/icons/ShoppingCartOutlined";

import "./Header.css";
import {
  ShoppingBasket,
  ShoppingCart,
  AccountCircle,
} from "@material-ui/icons";
import {
  Avatar,
  Badge,
  CardMedia,
  CircularProgress,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@material-ui/core";
import { useState } from "react";
import styled, { keyframes } from "styled-components";
import blue from "./logos/blue.png";
import blueCard from "./logos/blueCard.png";
import blueFire from "./logos/blueFire.png";
import Add from "@material-ui/icons/Add";

export default function Header({ loading }) {
  const [{ basket, user }, dispatch] = useStateValue();
  console.log("l9a7baaaa", user?.photoURL);
  const history = useHistory();

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const HandeleAuthentication = () => {
    if (user) {
      auth
        .signOut()
        .then((auth) => {
          history.push("/");
        })
        .catch((err) => alert(err));
    }
  };

  return (
    <div className="header">
      <div className="headerLogo">
        <FireAvatar
          component={Link}
          to=""
          src={blueFire} //"http://pngimg.com/uploads/amazon/amazon_PNG11.png"
        />
        <CardAvatar component={Link} to="" src={blueCard} />
      </div>
      <div className="header__nav">
        <div className="header__option">
          <div>
            {!auth?.currentUser?.photoURL ? (
              <Pavatar
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={handleClick}
              >
                <CircularProgress color="inherit" />
              </Pavatar>
            ) : (
              <Pavatar
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={handleClick}
                src={auth?.currentUser?.photoURL}
              />
            )}
            <Menu
              style={{
                marginTop: "18px",
              }}
              id="simple-menu"
              getContentAnchorEl={null}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              {!user ? (
                ""
              ) : (
                <>
                  {user.email === "ysimo44@gmail.com" && (
                    <MenuItem
                      component={Link}
                      to="/products"
                      onClick={handleClose}
                    >
                      <ListItemIcon>
                        <Add fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Add Products" />
                    </MenuItem>
                  )}

                  <MenuItem
                    component={Link}
                    to="/profile"
                    onClick={handleClose}
                  >
                    <ListItemIcon>
                      <AccountCircle fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Profile" />
                  </MenuItem>

                  <MenuItem
                    component={Link}
                    to={user && "/orders"}
                    onClick={handleClose}
                  >
                    <ListItemIcon>
                      <ShoppingCart fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Orders" />
                  </MenuItem>
                </>
              )}

              <MenuItem
                component={Link}
                to={!user && "/login"}
                onClick={() => {
                  handleClose();
                  HandeleAuthentication();
                }}
              >
                <ListItemIcon>
                  <Icon>logout</Icon>
                </ListItemIcon>
                <ListItemText primary={user ? "Sing Out" : "Sing in"} />
              </MenuItem>
            </Menu>
          </div>
          <span className="header__optionLoneOne">
            Hello{" "}
            <strong>
              {" "}
              {user?.displayName
                ? user?.displayName
                : !user?.email
                ? "Gest"
                : user?.email}
            </strong>
          </span>
        </div>

        <div className="header_optionBasket">
          <IconButton
            className="shoppingBasket"
            color="inherit"
            component={Link}
            to="/checkout"
          >
            <Badge badgeContent={basket?.length} color="secondary">
              <ShoppingCarOutlinedtIcon />
            </Badge>
          </IconButton>
        </div>
      </div>
    </div>
  );
}
const Pavatar = styled(Avatar)`
  cursor: pointer;
  img {
    object-fit: cover;
  }
`;
const rotate = keyframes`
  100% {
    transform: rotate(360deg);
  }
`;

const FireAvatar = styled(Avatar)`
  width: 60px !important;
  height: 60px !important;
  cursor: pointer;
  animation: ${rotate} 3s linear infinite;
`;
const CardAvatar = styled(Avatar)`
  position: absolute !important;
  width: 30px !important;
  height: 30px !important;
  cursor: pointer;
  img {
    object-fit: contain;
  }
`;
