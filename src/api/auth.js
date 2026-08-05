import { api, setToken, clearToken } from "./client";

export const authApi = {
  async login(email, password) {
    const { usuario, token } = await api.post("/auth/login", { email, password });
    setToken(token);
    return usuario;
  },

  async register({ nombre, email, password, telefono }) {
    const { usuario, token } = await api.post("/auth/register", { nombre, email, password, telefono });
    setToken(token);
    return usuario;
  },

  fetchCurrent() {
    return api.get("/auth/me");
  },

  logout() {
    clearToken();
  },
};
