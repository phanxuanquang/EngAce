import * as UrlApi from "../url";
import axios from "axios";
import Cookies from "js-cookie";
import baseRequest from "./BaseRequest";

export const AppService = {
  healCheck: (token) => {
    return axios.get(UrlApi.URL_GET_HEALCHECK, {
      headers: {
        Authentication: token,
      },
    });
  },

  getUserInfo: () => {
    return axios.get(UrlApi.URL_GET_USER_INFO, {
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    });
  },

  getEnglishLevel: () => {
    return baseRequest.get(UrlApi.URL_GET_ENGLISH_LEVEL);
  },

  getDictionarySearch: (keyword, context, useEnglishToExplain) => {
    return baseRequest.get(
      `${UrlApi.URL_GET_DICTIONARY_SEARCH}?keyword=${encodeURIComponent(
        keyword
      )}&context=${encodeURIComponent(
        context ?? ""
      )}&useEnglishToExplain=${encodeURIComponent(useEnglishToExplain)}`
    );
  },
};
