import { Navigate } from 'react-router-dom';
import { useParams } from "react-router-dom";
import { useStoreon } from 'storeon/react';
import { Spinner } from 'components/common';
import Show from 'components/show/Show';

const ShowPage = () => {
    const { id } = useParams();
    const { app: { catalog, history } } = useStoreon('app');
    if (!Boolean(catalog) || !Boolean(history)) return <Spinner />;

    const show = catalog.find(s => s.id === id);
    if (!Boolean(show)) return <Navigate to='/' />;

    return (
        <>
            <Show {...show} />
        </>
    );
};

export default ShowPage;
