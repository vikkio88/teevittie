import { io } from "socket.io-client";
const { REACT_APP_IS_DEV } = process.env;
const baseURL = `${REACT_APP_IS_DEV ? 'http://localhost:3001' : ''}`;


let client = null;
const getClient = async () => {
    if (client) return new Promise((resolve) => resolve(this));

    client = io(baseURL);
    return new Promise((resolve, reject) => {
        try {
            client.on('connect', () => {
                resolve(client);
            });
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });

};

export { getClient };