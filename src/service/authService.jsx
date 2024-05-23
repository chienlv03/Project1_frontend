import axios from "axios";

const REST_API_BASE_URL = "http://localhost:8080/api/auth/signup";

export const signupUser = (user) => axios.post(REST_API_BASE_URL, user);

