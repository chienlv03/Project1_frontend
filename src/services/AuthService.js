import axios from "axios";

const REST_API_BASE_URL = "http://localhost:8080/api/auth/";

export const signup = (user) => axios.post(REST_API_BASE_URL + 'signup', user);

export const signin = (user) => axios.post(REST_API_BASE_URL + 'signin', user);

