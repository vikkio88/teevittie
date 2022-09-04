import { Navigate } from 'react-router-dom';
import { useParams } from "react-router-dom";
import { useStoreon } from 'storeon/react';
import Show from 'components/show/Show';

export default () => {
    const { id } = useParams();
    const { app: { catalog } } = useStoreon('app');
    if (!Boolean(catalog)) return <span />;

    const show = catalog.find(s => s.id === id);
    if (!Boolean(show)) return <Navigate to='/' />;

    return (
        <>
            <Show {...show} />
        </>
    );
};