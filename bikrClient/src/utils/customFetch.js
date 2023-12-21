import axios from 'axios';
const customFetch = axios.create({
  baseURL: '/bikeapi/v1'
});

export default customFetch;
