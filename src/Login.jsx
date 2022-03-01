import "./Login.css";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import LockIcon from "@material-ui/icons/Lock";
import EmailIcon from "@material-ui/icons/Email";
import firebase from "firebase";
import { Link, useHistory } from "react-router-dom";
import { useState } from "react";
import { db, auth } from "./firebase";
import Loading from "./Loading";
import styled from "styled-components";
import { Avatar, IconButton, Button } from "@material-ui/core";
import Icon from "@material-ui/core/Icon";
import redFire from "./logos/redFire.png";
import redCard from "./logos/redCard.png";

export default function Login() {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [previewPhoto, setPreviewPhoto] = useState("");
  const [file, setFile] = useState({});
  const [success, setSuccess] = useState("");
  const [failure, setFailure] = useState("");

  const [emailVerification, setEmailVerification] = useState("");
  const [singUpVerifivcation, setSingUpVerifcation] = useState("");
  const [singInMode, setSingInMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [lighton, setLighton] = useState(false);

  const [lightonUp, setLightonUp] = useState(false);

  const [sendLoading, setSendLoading] = useState(false);

  const FlashOnOff = lighton ? FlashOn : FlashOff;
  const FlashOnOffUp = lightonUp ? FlashOn : FlashOff;

  const history = useHistory();
  const uploadImage = (e) => {
    setPreviewPhoto(URL.createObjectURL(e.target.files[0]));
    setFile(e.target.files[0]);
  };
  const singIn = (e) => {
    e.preventDefault();
    setEmailVerification("");
    setLoading(true);
    auth
      .signInWithEmailAndPassword(loginEmail, loginPassword)
      .then((authll) => {
        history.push("/");
        setLoginEmail("");
        setLoginPassword("");
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setEmailVerification(err.message);
        setTimeout(() => {
          setEmailVerification("");
        }, 5000);
      });
  };

  const singUp = (e) => {
    e.preventDefault();
    setSingUpVerifcation("");

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authl) => {
        setLoading(true);

        firebase
          .storage()
          .ref("users/" + authl.user.uid + "/profile.jpg")
          .put(file)
          .then((photoupdated) => {
            firebase
              .storage()
              .ref("users/" + authl.user.uid + "/profile.jpg")
              .getDownloadURL()
              .then((imgURL) => {
                authl.user
                  .updateProfile({
                    photoURL: imgURL,
                    displayName: userName,
                  })
                  .then((authll) => {
                    auth.currentUser.sendEmailVerification();
                    setLoading(false);
                    setUserName("");
                    setEmail("");
                    setPassword("");
                    setPreviewPhoto("");
                    setFile({});
                    history.push("/");
                  })
                  .catch((err) => {
                    setLoading(false);
                    setSingUpVerifcation(err.message);
                    setTimeout(() => {
                      setSingUpVerifcation("");
                    }, 5000);
                  });
              });
          })
          .catch((err) => {
            setLoading(false);
            setSingUpVerifcation(err.message);
            setTimeout(() => {
              setSingUpVerifcation("");
            }, 5000);
          });
      })
      .catch((err) => {
        setLoading(false);
        setSingUpVerifcation(err.message);
        setTimeout(() => {
          setSingUpVerifcation("");
        }, 5000);
      });
  };

  const forgotPassword = () => {
    setSendLoading(true);
    setSuccess("");
    setFailure("");
    auth
      .sendPasswordResetEmail(loginEmail)
      .then(() => {
        setSuccess("Password reset email sent!");
        setTimeout(() => {
          setSuccess("");
        }, 5000);
      })
      .catch((error) => {
        setFailure(error.message);
        setTimeout(() => {
          setFailure("");
        }, 5000);
      });
    setSendLoading(false);
  };

  return loading ? (
    <Loading />
  ) : (
    <div className={singInMode ? "container" : "container sign_up_mode"}>
      <div className="forms_container">
        <div className="signin_signup">
          <form className="foorm sign_in_form" onSubmit={singIn}>
            <h2 className="title">Sign In</h2>
            <div className="input_field">
              <EmailIcon className="icons" />
              <input
                required
                value={loginEmail}
                onChange={(e) =>
                  setLoginEmail(
                    !loginEmail ? e.target.value.trim() : e.target.value
                  )
                }
                type="text"
                placeholder="Email"
              />
            </div>

            <div
              className={
                lighton
                  ? "input_field password input__password"
                  : "input_field password "
              }
            >
              <LockIcon className="icons" />
              <input
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                type={lighton ? "text" : "password"}
                placeholder="Password"
              />
              <IconButton onClick={() => setLighton(!lighton)}>
                <FlashOnOff>flashlight_on</FlashOnOff>
              </IconButton>
            </div>
            <div className="badEmail">
              {emailVerification && (
                <p className="error">{emailVerification}</p>
              )}
            </div>
            <div className="loginOrChangePassword">
              <input type="submit" value="Login" className="btn solid" />
              <Button
                disabled={sendLoading}
                className="forgotPassword"
                onClick={forgotPassword}
              >
                {sendLoading ? "sending email..." : "forgot password"}
              </Button>
            </div>
            <div className="forgotedPassword">
              {success && <p className="success">{success}</p>}
              {failure && <p className="error">{failure}/empty</p>}
            </div>
          </form>
          <form className="foorm sign_up_form" onSubmit={singUp}>
            <h2 className="title">Sign Up</h2>
            <PhotoUpload>
              <label htmlFor="icon-button-file">
                <Photo src={previewPhoto} component="span" />
              </label>
              <input
                className="inputFileImage"
                required
                accept="image/*"
                id="icon-button-file"
                type="file"
                onChange={uploadImage}
              />
            </PhotoUpload>
            <div className="input_field">
              <AccountCircleIcon className="icons" />
              <input
                required
                value={userName}
                onChange={(e) =>
                  setUserName(
                    !userName ? e.target.value.trim() : e.target.value
                  )
                }
                type="text"
                placeholder="Username"
              />
            </div>
            <div className="input_field">
              <EmailIcon className="icons" />

              <input
                required
                value={email}
                onChange={(e) =>
                  setEmail(!email ? e.target.value.trim() : e.target.value)
                }
                type="email"
                placeholder="Email"
              />
            </div>

            <div
              className={
                lightonUp
                  ? "input_field password input__password"
                  : "input_field password "
              }
            >
              <LockIcon className="icons" />
              <input
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={lightonUp ? "text" : "password"}
                placeholder="Password"
              />
              <IconButton onClick={() => setLightonUp(!lightonUp)}>
                <FlashOnOffUp>flashlight_on</FlashOnOffUp>
              </IconButton>
            </div>
            {singUpVerifivcation && (
              <p className="error">{singUpVerifivcation}</p>
            )}
            <input type="submit" className="btn" value="Sing Up" />
          </form>
        </div>
      </div>

      <div className="panels_container">
        <div className="panel left_panel">
          <div className="content">
            <h3>New here ?</h3>
            <p>Sign up for free and experience Fire Store today</p>
            <button
              onClick={() => setSingInMode(false)}
              className="btn transparent"
              id="sign-up-btn"
            >
              Sign Up
            </button>
          </div>
          <Link className="image" to="/">
            <img className="fireLogo" alt="amazon logo" src={redFire} />
            <img className="cardLogo" alt="amazon logo" src={redCard} />
          </Link>
        </div>
        <div className="panel right_panel">
          <div className="content">
            <h3>One of us ?</h3>
            <p>Welcome. We're glad to see you.</p>
            <button
              onClick={() => setSingInMode(true)}
              className="btn transparent"
              id="sign-in-btn"
            >
              Sign In
            </button>
          </div>
          <Link className="image" to="/">
            <img className="fireLogo" alt="amazon logo" src={redFire} />
            <img className="cardLogo" alt="amazon logo" src={redCard} />
          </Link>
        </div>
      </div>
    </div>
  );
}

const Photo = styled(Avatar)`
  width: 70px;
  height: 70px;
  cursor: pointer;
`;
const PhotoUpload = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 80px;
  height: 80px;
  background-color: #f0f0f0;
  margin: 10px;
  border-radius: 50%;
`;
const FlashOn = styled(Icon)`
  color: #000;
  transform: rotate(-90deg);
`;
const FlashOff = styled(Icon)`
  color: #acacac;
`;
