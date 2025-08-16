import axios from "axios";

const baseUrl = "http://localhost:9000/api";

const api = axios.create({
  baseURL: baseUrl,
});

api.interceptors.request.use(
  (req) => {
    const token = JSON.parse(localStorage.getItem("token"));
    if (token) {
      req.headers["token"] = token;
    }
    return req; // ✅ always return the request
  },
  (err) => {
    return Promise.reject(err);
  }
);

export default api;
