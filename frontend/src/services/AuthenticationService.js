import Cookies from "js-cookie";
import axios from "axios";

export const signup = async data => {
  try {
    let response = await axios.post("http://localhost:3001/auth/signup", data);
    return response.data;
  } catch (err) {
    console.log(err);
    return err;
  }
};

export const login = async data => {
  try {
    let response = await axios.post("http://localhost:3001/auth/login", data, {
      withCredentials: true
    });
    console.log("response....", response);
    return response.data;
  } catch (err) {
    console.log(err);
    return err;
  }
};

export const logout = async data => {
  try {
    let response = await axios.post("http://localhost:3001/auth/logout", data, {
      withCredentials: true
    });
    return response.data;
  } catch (err) {
    console.log(err);
    return err;
  }
};

export const isAuthenticated = () => {
  console.log("token....", getToken());
  if (getToken()) {
    return true;
  }
  return false;
};

export const getToken = () => {
  return Cookies.get("token");
};
