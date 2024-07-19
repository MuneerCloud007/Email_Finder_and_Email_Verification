import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://143.110.179.72:5000', 
  headers: {
    'Content-Type': 'application/json',
  }
});

export default axiosInstance;
