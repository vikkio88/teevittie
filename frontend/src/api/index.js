import axios from 'axios';
const { REACT_APP_API_URL } = process.env;

const xhr = axios.create({
    baseURL: REACT_APP_API_URL
});

const api = {
    catalog: {
        async all() {
            const resp = await xhr.get('api/catalog');
            return resp.data;
        }
    }
};


export default api;