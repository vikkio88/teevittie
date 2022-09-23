import { useStoreon } from 'storeon/react';
import { Spinner } from 'components/common';
import { getClient } from 'api/ws';
import { useState } from 'react';

const TestPage = () => {
    const { app: { catalog, history } } = useStoreon('app');
    const [isConnected, setIsConnected] = useState(false);

    if (!Boolean(catalog) || !Boolean(history)) return <Spinner />;

    console.log(catalog);

    return (
        <>
            <h1>Test Page</h1>
            <button disabled={isConnected} onClick={async () => {
                try {
                    const client = await getClient();
                    if (client.id) setIsConnected(true);
                } catch (error) {
                    console.error(error);
                }
            }}>Connect</button>
            <button disabled={!isConnected} onClick={async () => {
                try {
                    const client = await getClient();
                    if (client.id) {
                        client.disconnect();
                    }
                    setIsConnected(false);
                } catch (error) {
                    console.error(error);
                }
            }}>Disconnect</button>

        </>
    );

};

export default TestPage;