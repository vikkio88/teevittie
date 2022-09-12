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
        async sync(data) {
            return xhr.put('/history', data);
        },
        async patch({ ids = [], finished }) {
            const toPatch = ids.map(id => ({ id, time: finished ? 1 : 0, finished }));
            if (!Boolean(toPatch.length)) return;
            return xhr.patch('/history', toPatch);
        }
    },
    streamUrl: videoId => `${baseURL}/stream/${videoId}`
};


export default api;