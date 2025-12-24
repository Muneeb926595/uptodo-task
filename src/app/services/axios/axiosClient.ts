import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 30_000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach interceptors in a separate file to avoid circular deps
import './interceptors';

export default axiosClient;
