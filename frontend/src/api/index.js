import axios from 'axios';
const { REACT_APP_IS_DEV } = process.env;
const baseURL = `${REACT_APP_IS_DEV ? 'http://localhost:3001' : ''}/api`;
const xhr = axios.create({
    baseURL
});

const api = {
    boot: {
        async get() {
            return xhr.get('/boot');
        }
    },
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
    streamUrl: videoId => `${baseURL}/stream/${videoId}`,
    subs: {
        urlFromVideoId: (videoId, trackIndex) => `${baseURL}/subs/${videoId}?track=${trackIndex}`,
        async get(videoId) {
            return xhr.get(`/subs/${videoId}`);
        }
    },

    // this is shit, will reimplement with ws soon
    cast: {
        async play(videoId) {
            return xhr.post(`cast/${videoId}`);
        },
        async pause() {
            return xhr.put(`cast`, { command: 'pause' });
        },
        async resume() {
            return xhr.put(`cast`, { command: 'resume' });
        }
    }
};


export default api;