import { Navigate } from 'react-router-dom';
import { useParams } from "react-router-dom";
import { useStoreon } from 'storeon/react';

export default () => {
    const { id } = useParams();
    const { app: { catalog } } = useStoreon('app');
    const show = catalog.find(s => s.id === id);

    if (!Boolean(show)) return <Navigate to='/' />;

    return (
        <>
            <h1>{show.name}</h1>
        </>
    );
};