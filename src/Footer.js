import styled from "styled-components";
import blue from "./logos/blue.png";
import { Link, useHistory } from "react-router-dom";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import MailIcon from "@material-ui/icons/Mail";
import PhoneIcon from "@material-ui/icons/Phone";
import RoomIcon from "@material-ui/icons/Room";
import { db, auth } from "./firebase";

import { Button } from "@material-ui/core";
import { useStateValue } from "./StateProvider";
export default function Footer() {
  const [{ basket, user }, dispatch] = useStateValue();
  const history = useHistory();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
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
    <Box>
      <Container>
        <AboutUs>
          <TitleInfo>About US</TitleInfo>
          <Info>
            We started Fire Store with a single purpose, to provide the finest
            Men's Clothing, Women's Clothing, Jewelery, Electronics to evryone.
          </Info>
        </AboutUs>
        <GetInTouch>
          <TitleInfo>Get In Touch</TitleInfo>
          <Info>
            <PhoneIcon /> +212 628901934
          </Info>
          <Info>
            <MailIcon /> info@Firestore.com
          </Info>
          <Info>
            <AccessTimeIcon /> Mon - Fri, 9AM - 10PM
          </Info>
        </GetInTouch>
        <QuickLinks>
          <TitleInfo>Quick Links</TitleInfo>

          <Links onClick={scrollToTop} component={Link} to="">
            Home
          </Links>
          {user && (
            <Links component={Link} to="/profile">
              Profile
            </Links>
          )}

          {user && (
            <Links component={Link} to="">
              Orders
            </Links>
          )}

          {user ? (
            <Links onClick={HandeleAuthentication}>Sing Out</Links>
          ) : (
            <Links component={Link} to="/login">
              Sing In
            </Links>
          )}
        </QuickLinks>

        <PleaseContactUs>
          <TitleInfo> Contact US</TitleInfo>
          <PleaseContactUsForm
            action="https://formsubmit.co/yahyataqsi@gmail.com"
            method="POST"
          >
            <input type="hidden" name="_captcha" value="false" />

            <input
              type="email"
              name="email"
              required
              placeholder="your@email.com"
            />
            <input
              type="hidden"
              name="_next"
              value="https://clone-903bd.web.app"
            />
            <input type="hidden" name="_subject" value="New email woooo!" />
            <textarea
              // onChange={(e) => setDescriptionAdd(e.target.value)}
              name="message"
              required
              cols="30"
              rows="7"
              style={{ resize: "none" }}
              placeholder="Your Questions"
              //   value={descriptionAdd}
            ></textarea>

            <Links type="submit">Submit</Links>
          </PleaseContactUsForm>
        </PleaseContactUs>
      </Container>
    </Box>
  );
}

/*

  Complain
  Suggestion
  Feedback
  Enquiry
  Delay Order
  Other

*/

const Links = styled(Button)`
  color: #fff !important;
`;

const Box = styled.div`
  padding: 80px 20px;
  background: #131921;
  bottom: 0;
  margin-top: 20px;
  width: 100%;
`;
const Container = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  @media (max-width: 625px) {
    justify-content: center;
  }
`;
const ImageContainer = styled.img`
  width: 40%;
`;

const Info = styled.p`
  width: 100%;
  display: flex;
  color: #fff;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const TitleInfo = styled(Info)`
  font-size: 20px;
  font-weight: 700;
`;

const AboutUs = styled.div`
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  width: 20%;
  min-height: 290px;

  @media (max-width: 1060px) {
    margin-bottom: 30px;
    width: 30%;
    border-bottom: 1px solid #fff;
    border-radius: 50% 50% 82% 18% / 84% 86% 14% 16%;
  }

  @media (max-width: 860px) {
    margin-bottom: 30px;
    width: 45%;
    border-bottom: 1px solid #fff;
    border-radius: 50% 50% 82% 18% / 84% 86% 14% 16%;
  }
  @media (max-width: 625px) {
    margin-bottom: 30px;
    width: 70%;
    border-bottom: 1px solid #fff;
    border-radius: 50% 50% 82% 18% / 84% 86% 14% 16%;
  }
  @media (max-width: 425px) {
    margin-bottom: 30px;
    width: 90%;
    border-bottom: 1px solid #fff;
    border-radius: 50% 50% 82% 18% / 84% 86% 14% 16%;
  }
`;
const GetInTouch = styled(AboutUs)``;

const QuickLinks = styled(AboutUs)`
  button,
  a {
    box-shadow: 1px 1px 3px #10151c, -1px -1px 3px #161d26 !important;
    width: 100%;
  }
`;
const PleaseContactUs = styled(AboutUs)``;
const PleaseContactUsForm = styled.form`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  width: 100%;
  button {
    width: 100%;
    box-shadow: 1px 1px 3px #10151c, -1px -1px 3px #161d26 !important;
  }
  input,
  textarea {
    border-radius: 5px;
    padding: 5px 10px;
    width: 100%;
    margin-bottom: 7px;
    border: none;
    outline: 0;
  }
  textarea::-webkit-scrollbar {
    width: 5px;
  }
  textarea::-webkit-scrollbar-thumb {
    background-color: #131921;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
  }
`;
