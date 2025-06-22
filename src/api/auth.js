import axios from "axios";
import { API1 } from "../config";

export const register = data =>
  axios.post(`${API1}/api/auth/register`, data).then(r => r.data);

export const login = data =>
  axios.post(`${API1}/api/auth/login`, data).then(r => r.data);

export const listarUsuarios = () =>
  axios.get(`${API1}/api/auth/usuarios`).then(r => r.data);

export const getUsuario = id =>
  axios.get(`${API1}/api/auth/usuario/${id}`).then(r => r.data);

export const eliminarUsuario = id =>
  axios.delete(`${API1}/api/auth/usuario/${id}`).then(r => r.data);  // ← faltaba /api/auth
