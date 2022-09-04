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
    },
    history: {
        async sync({ id, time = 0, finished = false }) {
            return xhr.post('/history', { id, time, finished });
        }
    }
};


export default api;