import axios from "axios";
import { api } from "../common/http-common";
const API_URL = api.uri;

class AuthService {
  login(username: string, password: string) {
    return axios
      .post(API_URL + "/signin", {
        username,
        password
      })
      .then(response => {
        if (response.data) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }

        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("user");
  }

  register(username: string, email: string, password: string,firstname:string,lastname:string) {
    return axios.post(API_URL + "/signup", {
      username,
      email,
      password,
      firstname,
      lastname
    })
      ;
  }

  getCurrentUser() {
    const userStr = localStorage.getItem("user");
    if (userStr) return JSON.parse(userStr);

    return null;
  }
}

export default new AuthService();
