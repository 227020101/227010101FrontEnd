import axios from 'axios';
import authHeader from './auth-header';
import { api } from "../common/http-common";
const API_URL = api.uri;

class UserService {
  getPublicContent() {
    return axios.get(API_URL + '/Cats');
  }
  getUserBoard() {
    return axios.get(API_URL + '/user', { headers: authHeader() });
  }

  getModeratorBoard() {
    return axios.get(API_URL + '/mod', { headers: authHeader() });
  }

  getAdminBoard() {
    return axios.get(API_URL + '/admin', { headers: authHeader() });
  }
}

export default new UserService();
