import axios from "axios";

export const url = 'http://localhost:8080';

export const api = axios.create({
    baseURL: url
  });