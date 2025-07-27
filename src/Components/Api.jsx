import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api/v1/user" });

export const saveCart = (userId, items) => API.post("/cart", { userId, items });
export const getCart = (userId) => API.get(`/getcart${userId}`);
