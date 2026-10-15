
import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api"
});

export const getApplications = (params = {}) =>
    api.get("/applications", { params });

export const createApplication = (data) =>
    api.post("/applications", data);

export const updateApplication = (id, data) =>
    api.put(`/applications/${id}`, data);

export const deleteApplication = (id) =>
    api.delete(`/applications/${id}`);

export const getApplicationStats = () =>
    api.get("/applications/stats");
