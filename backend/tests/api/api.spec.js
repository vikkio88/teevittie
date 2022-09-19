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

    test('get /api/boot', async ({ client, expect }) => {
        const response = await client.get('/api/boot');
        expect(response.status()).toBe(200);
    });

    test('get /api/catalog', async ({ client, expect }) => {
        const response = await client.get('/api/catalog');
        expect(response.status()).toBe(200);
    });

    test('put /api/history', async ({ client, expect }) => {
        const response = await client.put('/api/history').json({ id: 'someId', time: 1, finished: false });
        expect(response.status()).toBe(200);
    });


    test('patch /api/history', async ({ client, expect }) => {
        const response = await client.patch('/api/history').json([{ id: 'someId', time: 1, finished: false }, { id: 'someId2', time: 1, finished: false }]);
        expect(response.status()).toBe(200);
    });

    test('get /api/catalog without a file db', async ({ client, expect }) => {
        if (fs.existsSync(`./tmp/${TEE_FOLDER_DB_NAME}`)) {
            fs.rmSync(`./tmp/${TEE_FOLDER_DB_NAME}`);
        }
        const response = await client.get('/api/catalog');
        expect(response.status()).toBe(200);
    });

    test('get /api/stream', async ({ client, expect }) => {
        const response = await client.get('/api/catalog');
        expect(response.status()).toBe(200);
        const { catalog = {} } = response.body();
        const firstEpisodeId = catalog[0].seasons[0].episodes[0].fullId;

        let responseStream = await client.get(`/api/stream/${firstEpisodeId}`);
        expect(responseStream.status()).toBe(400);
        responseStream = await client.get(`/api/stream/someRandomId`).header('range', 0);
        expect(responseStream.status()).toBe(404);
        responseStream = await client.get(`/api/stream/${firstEpisodeId}`).header('range', 0);
        expect(responseStream.status()).toBe(206);
    });

    test('get /api/subs', async ({ client, expect }) => {
        const response = await client.get('/api/catalog');
        expect(response.status()).toBe(200);
        const { catalog = {} } = response.body();
        const episodeWithoutSubs = catalog[0].seasons[0].episodes.find(e => e.subs === null);
        let episodeWithSubs = catalog[0].seasons[0].episodes.find(e => e.subs !== null);
        if (episodeWithSubs === null) {
            episodeWithSubs = catalog[1].seasons[0].episodes.find(e => e.subs !== null);
        }

        let responseStream = await client.get(`/api/subs/someRandomId`);
        expect(responseStream.status()).toBe(400);
        responseStream = await client.get(`/api/subs/${episodeWithoutSubs.fullId}`);
        expect(responseStream.status()).toBe(404);
        responseStream = await client.get(`/api/subs/${episodeWithSubs.fullId}`);
        expect(responseStream.status()).toBe(200);
    });

    test('post /api/shutdown', async ({ client, expect }) => {
        const response = await client.post('/api/shutdown');
        expect(response.status()).toBe(202);

        expect(fs.existsSync(`./tmp/${TEE_FOLDER_DB_NAME}`)).toBe(true);
        fs.rmSync(`./tmp/${TEE_FOLDER_DB_NAME}`);
    });
});
