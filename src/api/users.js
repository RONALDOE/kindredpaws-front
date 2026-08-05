import { api } from "./client";

export const usersApi = {
  list: () => api.get("/usuarios"),
  get: (id) => api.get(`/usuarios/${id}`),
  update: (id, data) => api.patch(`/usuarios/${id}`, data),
  remove: (id) => api.del(`/usuarios/${id}`),
};
