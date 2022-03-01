import axios from "axios";
const instance = axios.create({
  baseURL: "https://us-central1-clone-903bd.cloudfunctions.net/api",
});
export default instance;
// ! "http://localhost:5001/clone-903bd/us-central1/api"
// ! "https://us-central1-clone-903bd.cloudfunctions.net/api",
