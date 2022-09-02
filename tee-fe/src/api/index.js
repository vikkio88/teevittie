import axios from 'axios';
const { REACT_APP_API_URL } = process.env;

const xhr = axios.create({
    baseURL: REACT_APP_API_URL
});

const api = {
    catalog: {
        async all() {
            return xhr.get('/catalog');
        }
    }
};


export default api;