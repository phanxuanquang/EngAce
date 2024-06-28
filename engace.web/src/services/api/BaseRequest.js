import axios from "axios";
import { DOMAIN_NAME } from "../url";
import Cookies from "js-cookie";

const baseRequest = axios.create({
  baseURL: DOMAIN_NAME,
  headers: {
    Authentication: Cookies.get("token"),
    "Content-Type": "application/json",
  },
});

export default baseRequest;
