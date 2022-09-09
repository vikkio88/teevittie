const { test } = require('@japa/runner');
const fs = require('fs');
const { TEE_FOLDER_DB_NAME } = require('../../src/config');

test.group('Api smoke tests', () => {
    test('get FE /', async ({ client, expect }) => {
        const response = await client.get('/');
        expect(response.status()).toBe(200);
        expect(response.header('content-type')).toContain('text/html');
    });

    test('get /api/ping', async ({ client, expect }) => {
        const response = await client.get('/api/ping');
        expect(response.status()).toBe(200);
        expect(response.body()).toEqual({ pong: 1 });
    });

    test('get /api/catalog', async ({ client, expect }) => {
        const response = await client.get('/api/catalog');
        expect(response.status()).toBe(200);
        expect(fs.existsSync(`./tmp/${TEE_FOLDER_DB_NAME}`)).toBe(true);
    });

    test('get /api/catalog without a file db', async ({ client, expect }) => {
        if (fs.existsSync(`./tmp/${TEE_FOLDER_DB_NAME}`)) {
            fs.rmSync(`./tmp/${TEE_FOLDER_DB_NAME}`);
        }
        const response = await client.get('/api/catalog');
        expect(response.status()).toBe(200);
    });

    test('post /api/shutdown', async ({ client, expect }) => {
        const response = await client.post('/api/shutdown');
        expect(response.status()).toBe(202);

        expect(fs.existsSync(`./tmp/${TEE_FOLDER_DB_NAME}`)).toBe(true);
    });
});