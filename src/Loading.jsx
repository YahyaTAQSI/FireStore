import { CircularProgress, Typography } from "@material-ui/core";
import styled from "styled-components";
import Lottie from "react-lottie";

import * as LoadingBag from "./shoppingBag.json";
import { useHistory } from "react-router-dom";

export default function Loading() {
  const history = useHistory();
  // const [loading, setLoading] = useState(true);

  // const [progress, setProgress] = useState(0);
  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setProgress((prevProgress) =>
  //       prevProgress >= 100
  //         ? 0
  //         : prevProgress + Math.floor(Math.random() * 9) + 1
  //     );
  //   }, 200);

  //   return () => clearInterval(timer);
  // }, []);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: LoadingBag.default,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <Container>
      <SubContainer>
        <Wrapper>
          <Lottie options={defaultOptions} height={300} width={300} />

          <Progress size={295} thickness={1} />
        </Wrapper>
        <Typography variant="body1" color="textPrimary">
          Please wait a moment
        </Typography>
      </SubContainer>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const SubContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
`;
const Wrapper = styled.div`
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
`;
const Progress = styled(CircularProgress)`
  z-index: 1;
  position: absolute;
  color: #ea6266 !important;
`;
