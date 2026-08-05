import { api } from "./client";

function toQueryString(filters) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export const reportsApi = {
  list: (filters = {}) => api.get(`/reportes${toQueryString(filters)}`),
  get: (id) => api.get(`/reportes/${id}`),
  byUser: (userId) => api.get(`/reportes${toQueryString({ usuarioId: userId })}`),
  create: (data) => api.post("/reportes", data),
  update: (id, data) => api.patch(`/reportes/${id}`, data),
  remove: (id) => api.del(`/reportes/${id}`),
  addVista: (id) => api.post(`/reportes/${id}/vista`),
};
