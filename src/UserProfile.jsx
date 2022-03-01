import styled from "styled-components";
import firebase from "firebase";
import PersonIcon from "@material-ui/icons/Person";
import PhoneIcon from "@material-ui/icons/Phone";
import DoneIcon from "@material-ui/icons/Done";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";

import {
  Tooltip,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Avatar,
  Input,
  InputAdornment,
  TextField,
  Zoom,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { db, auth, storage } from "./firebase";

import { useState } from "react";
import { EmailRounded } from "@material-ui/icons";
import Lock from "@material-ui/icons/Lock";
import { useStateValue } from "./StateProvider";

export default function UserProfile() {
  const [{ basket, user }, dispatch] = useStateValue();

  const history = useHistory();

  const profileUser = auth.currentUser;

  const UpdateDone = <Updated endIcon={<DoneIcon />}>updated </Updated>;
  const PhotChnaged = (
    <PhotoUpdateDone endIcon={<DoneIcon />}>updated</PhotoUpdateDone>
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");

  const [password, setPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");

  const [image, setImage] = useState(profileUser?.photoURL);
  const [file, setFile] = useState({});

  const [nameError, setNameError] = useState("");
  const [photoError, setPhotoError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [nameSuccess, setNameSuccess] = useState(false);
  const [PhotoSuccess, setPhotoSuccess] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const UpdateNewEmail = () => {
    setEmailError("");
    const credential = firebase.auth.EmailAuthProvider.credential(
      profileUser.email,
      verifyPassword
    );
    profileUser
      .reauthenticateWithCredential(credential)
      .then(() => {
        profileUser
          .updateEmail(email)
          .then(() => {
            profileUser.sendEmailVerification();
            setEmailSuccess(true);
            setEmail("");
            setVerifyPassword("");
            setTimeout(() => {
              setEmailSuccess(false);
            }, 5000);
          })
          .catch((error) => {
            setEmailError(error.message);
            setTimeout(() => {
              setEmailError("");
            }, 5000);
          });
      })
      .catch((error) => {
        setEmailError("");
        setEmailError(error.message);
        setTimeout(() => {
          setEmailError("");
        }, 5000);
      });
  };

  const UpdateNewPassword = () => {
    setPasswordError("");
    const credential = firebase.auth.EmailAuthProvider.credential(
      profileUser.email,
      oldPassword
    );
    profileUser
      .reauthenticateWithCredential(credential)
      .then(() => {
        profileUser
          .updatePassword(password)
          .then(() => {
            setPasswordSuccess(true);
            setPassword("");
            setOldPassword("");
            setTimeout(() => {
              setPasswordSuccess(false);
            }, 5000);
          })
          .catch((error) => {
            setPasswordError(error.message);
            setTimeout(() => {
              setPasswordError("");
            }, 5000);
          });
      })
      .catch((error) => {
        setPasswordError("");
        setPasswordError(error.message);
        setTimeout(() => {
          setPasswordError("");
        }, 5000);
      });
  };

  const UpdateProfileName = (e) => {
    e.preventDefault();

    profileUser
      .updateProfile({
        displayName: name,
      })
      .then((suc) => {
        setNameSuccess(true);
        setName("");
        dispatch({
          type: "SET_USER",
          user: profileUser,
        });
        setTimeout(() => {
          setNameSuccess(false);
        }, 5000);
      })
      .catch((err) => {
        setNameError(err.message);
        setTimeout(() => {
          setNameError("");
        }, 5000);
      });
  };

  const updateProfilePhoto = (e) => {
    e.preventDefault();
    storage
      .ref()
      .child(`users/${profileUser.uid}/profile.jpg`)
      .delete()
      .then(() => {
        storage
          .ref("users/" + profileUser.uid + "/profile.jpg")
          .put(file)
          .then((photoupdated) => {
            storage
              .ref("users/" + profileUser.uid + "/profile.jpg")
              .getDownloadURL()
              .then((imgURL) => {
                profileUser
                  .updateProfile({
                    photoURL: imgURL,
                  })
                  .then((suc) => {
                    setPhotoSuccess(true);
                    dispatch({
                      type: "SET_USER",
                      user: profileUser,
                    });
                    setTimeout(() => {
                      setPhotoSuccess(false);
                    }, 5000);
                  })
                  .catch((err) => {
                    setPhotoError(err.message);
                    setTimeout(() => {
                      setPhotoError("");
                    }, 5000);
                  });
              });
          });
      })
      .catch((error) => {
        setPhotoError(error.message);
        setTimeout(() => {
          setPhotoError("");
        }, 5000);
      });
  };

  const uploadImage = (e) => {
    if (e.target.files[0]) {
      setImage("");
      setFile({});
      setImage(URL.createObjectURL(e.target.files[0]));
      setFile(e.target.files[0]);
    }
  };

  return (
    <Main>
      <Container>
        <Card>
          <CardContent>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              p={2}
              marginBottom={3}
            >
              <CardHeader
                subheader="The information can be edited"
                title="Profile"
              />
              <UpdatePic onSubmit={updateProfilePhoto}>
                <PhotoUpload>
                  <label htmlFor="updatePhotoProfile">
                    <Tooltip
                      arrow
                      title="Upload Photo"
                      placement="bottom-start"
                      TransitionComponent={Zoom}
                    >
                      <Photo src={image} component="span" />
                    </Tooltip>
                  </label>

                  <HidenInput
                    required
                    className="inputFileUpdatePhoto"
                    accept="image/*"
                    id="updatePhotoProfile"
                    type="file"
                    onChange={uploadImage}
                  />
                </PhotoUpload>
                {PhotoSuccess ? (
                  PhotChnaged
                ) : (
                  <PhotoUpdate type="submit">Update</PhotoUpdate>
                )}
              </UpdatePic>
              {photoError && <ErrorMessage>{photoError}</ErrorMessage>}
            </Box>
            <form onSubmit={UpdateProfileName}>
              <MiniGrid item md={12} xs={12}>
                <InputText
                  disableUnderline
                  type="text"
                  startAdornment={
                    <InputAdornment position="start">
                      <PersonIcon color="action" />
                    </InputAdornment>
                  }
                  placeholder="New User Name"
                  required
                  helperText="Please Add The User Name."
                  value={name}
                  onChange={(e) =>
                    setName(!name ? e.target.value.trim() : e.target.value)
                  }
                />
                {nameSuccess ? (
                  UpdateDone
                ) : (
                  <UpdateButton type="submit" variant="contained">
                    update User Name
                  </UpdateButton>
                )}
              </MiniGrid>
            </form>
            {nameError && <ErrorMessage>{nameError}</ErrorMessage>}
          </CardContent>

          <Divider />
          <CardContent>
            <Grid container spacing={3}>
              <MiniGrid item md={12} xs={12}>
                <Verification>
                  <InputText
                    fullWidth
                    disableUnderline
                    type="text"
                    startAdornment={
                      <InputAdornment position="start">
                        <EmailRounded color="action" />
                      </InputAdornment>
                    }
                    placeholder="New Email"
                    required
                    helperText="Please Add The User Email."
                    value={email}
                    onChange={(e) =>
                      setEmail(!email ? e.target.value.trim() : e.target.value)
                    }
                  />
                  <InputText
                    fullWidth
                    disableUnderline
                    type="password"
                    startAdornment={
                      <InputAdornment position="start">
                        <Lock color="action" />
                      </InputAdornment>
                    }
                    placeholder="Current Password"
                    required
                    value={verifyPassword}
                    onChange={(e) =>
                      setVerifyPassword(
                        !verifyPassword ? e.target.value.trim() : e.target.value
                      )
                    }
                  />
                </Verification>
                {emailSuccess ? (
                  UpdateDone
                ) : (
                  <UpdateButton variant="contained" onClick={UpdateNewEmail}>
                    Update Email
                  </UpdateButton>
                )}
              </MiniGrid>
            </Grid>
          </CardContent>
          {emailError && <ErrorMessage>{emailError}</ErrorMessage>}

          <Divider />

          <CardContent>
            <Grid container spacing={3}>
              <MiniGrid item md={12} xs={12}>
                <Verification>
                  <InputText
                    fullWidth
                    disableUnderline
                    type="text"
                    startAdornment={
                      <InputAdornment position="start">
                        <Lock color="action" />
                      </InputAdornment>
                    }
                    placeholder="New Password"
                    required
                    helperText="Please Add The User Password."
                    value={password}
                    onChange={(e) =>
                      setPassword(
                        !password ? e.target.value.trim() : e.target.value
                      )
                    }
                  />

                  <InputText
                    fullWidth
                    disableUnderline
                    type="password"
                    startAdornment={
                      <InputAdornment position="start">
                        <Lock color="action" />
                      </InputAdornment>
                    }
                    placeholder="Current Password"
                    required
                    value={oldPassword}
                    onChange={(e) =>
                      setOldPassword(
                        !oldPassword ? e.target.value.trim() : e.target.value
                      )
                    }
                  />
                </Verification>

                {passwordSuccess ? (
                  UpdateDone
                ) : (
                  <UpdateButton variant="contained" onClick={UpdateNewPassword}>
                    Update Password
                  </UpdateButton>
                )}
              </MiniGrid>
            </Grid>
          </CardContent>
          {passwordError && <ErrorMessage>{passwordError}</ErrorMessage>}
        </Card>
      </Container>
    </Main>
  );
}
const Verification = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  flex-direction: column;
  width: 60%;
  height: 110px;
  @media (max-width: 660px) {
    width: 80%;
  }
`;
const ErrorMessage = styled.p`
  margin-bottom: 5px;
  text-align: center;
  color: #d8000c;
`;

const UpdateButton = styled(Button)`
  background-color: #131921 !important;
  color: #fff !important;
  font-size: 11px !important;
  margin-top: 13px !important;
  width: 150px;
  @media (max-width: 660px) {
    width: 80%;
  }
`;

const PhotoUpdate = styled(UpdateButton)`
  width: 100px;
  position: absolute !important;
  bottom: -10px;
  border-bottom-left-radius: 50% !important;
  border-bottom-right-radius: 50% !important;
`;

const PhotoUpdateDone = styled(PhotoUpdate)`
  background-color: #4f8a10 !important;
`;
const UpdatePic = styled.form`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  position: relative;
`;

const Updated = styled(UpdateButton)`
  background-color: #4f8a10 !important;
`;

const Main = styled.main`
  display: flex;
  align-items: center;
  justify-content: center;
`;
const HidenInput = styled.input`
  position: absolute;
  z-index: -1;
  width: 50px;
`;

const MiniGrid = styled(Grid)`
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-wrap: wrap;
`;

const Container = styled.div`
  margin-top: 10px;
  padding: 20px;
  width: 80%;

  @media (max-width: 425px) {
    width: 95%;
  }
`;
const Photo = styled(Avatar)`
  width: 100px !important;
  height: 100px !important;

  cursor: pointer;
  img {
    object-fit: contain;
  }
`;
const PhotoUpload = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const InputText = styled(Input)`
  @media (max-width: 660px) {
    width: 80%;
  }
  width: 60%;
  height: 40px;
  border: none;
  border-radius: 10px;
  align-items: center;
  padding: 10px;
  background: #ffffff;
  box-shadow: 3px 3px 10px #949494, -3px -3px 10px #ffffff,
    -3px -3px 10px #949494, 3px 3px 10px #ffffff;
  Input {
    margin-left: 5px;
  }
`;
/*
{
                  */
