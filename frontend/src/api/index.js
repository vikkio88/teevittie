import axios from 'axios';
const { REACT_APP_IS_DEV } = process.env;
const baseURL = `${REACT_APP_IS_DEV ? 'http://localhost:3001' : ''}/api`;
const xhr = axios.create({
    baseURL
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
    },
    streamUrl: videoId => `${baseURL}/stream/${videoId}`
};


export default api;