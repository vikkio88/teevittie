import { Navigate } from 'react-router-dom';
import { useParams } from "react-router-dom";
import { useStoreon } from 'storeon/react';
import { Spinner } from 'components/common';
import Show from 'components/show/Show';
import { catalogHelper } from 'libs/helpers';

const ShowPage = () => {
    const { id } = useParams();
    const { dispatch, app: { catalog, history } } = useStoreon('app');
    if (!Boolean(catalog) || !Boolean(history)) return <Spinner />;

    const show = catalogHelper.getShowById(id, catalog);
    if (!Boolean(show)) return <Navigate to='/' />;

    return (
        <>
            <Show {...show} history={history} dispatch={dispatch} />
        </>
    );
};

export default ShowPage;
