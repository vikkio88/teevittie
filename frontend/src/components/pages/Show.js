import { Redirect } from 'react-router-dom';
import { useStoreon } from 'storeon/react';

export default ({ match }) => {
    const { params } = match;
    const { app: { catalog } } = useStoreon('app');
    const show = catalog.find(s => s.id === params.id);

    if (!Boolean(show)) return <Redirect to='/' />;

    return (
        <>
            <h1>{show.name}</h1>
        </>
    );
};