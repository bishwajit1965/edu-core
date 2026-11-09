import axiosInstance from "./axios.js";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

const apiService = {
  async getAll(endpoint: string) {
    const res = await axiosInstance.get(`${API_BASE_URL}/${endpoint}`);
    console.log("Raw response from API:", res.data); // 👈 log here to confirm
    return res.data;
  },

  async getById(endpoint: string, id: string | number) {
    const res = await axiosInstance.get(`${API_BASE_URL}/${endpoint}/${id}`);
    return res.data;
  },

  async create(path: string, data: unknown) {
    const res = await axiosInstance.post(`${API_BASE_URL}/${path}`, data);
    return res.data;
  },

  async update(path: string, data: unknown) {
    const res = await axiosInstance.patch(`${API_BASE_URL}/${path}`, data);
    return res.data;
  },
  async delete(path: string) {
    const res = await axiosInstance.delete(`${API_BASE_URL}/${path}`);
    return res.data;
  },
};

export default apiService;
