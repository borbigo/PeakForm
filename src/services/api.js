import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

//change to actual backend later
const API_URL = __DEV__ ? 'http://localhost:3000/api' : 'https://your-production-url.com/api';

const api = axios.create({
  baseUrl: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

//add auth tokens to requests
api.interceptors.request.use(
  async(config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;