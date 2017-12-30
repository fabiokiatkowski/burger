import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://react-my-burger-cff0d.firebaseio.com/'
});

export default instance;
