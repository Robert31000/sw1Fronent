import axios from 'axios';
import { API2 } from '../config';

const BASE_URL = `${API2}/api/habitaciones`;

export const crearHabitacion = (data) =>
  axios.post(BASE_URL, data).then(res => res.data);

export const listarHabitaciones = () =>
  axios.get(BASE_URL).then(res => res.data);

export const obtenerHabitacion = (id) =>
  axios.get(`${BASE_URL}/${id}`).then(res => res.data);

export const eliminarHabitacion = (id) =>
  axios.delete(`${BASE_URL}/${id}`).then(res => res.data);
