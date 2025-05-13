import axios from "axios";

const baseUrl = "https://jsonplaceholder.typicode.com";

const api = axios.create({
  baseURL: baseUrl,
});

export default api;
