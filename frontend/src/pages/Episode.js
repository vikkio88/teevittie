import { Spinner } from 'components/common';
import Episode from 'components/episode/Episode';
import { Link, useParams } from "react-router-dom";
import { useStoreon } from 'storeon/react';

export default () => {
    const { id } = useParams();
    const { app: { history, seasonsMap } } = useStoreon('app');
    if (!history) return <Spinner />;

    const ids = id.split('.');
    return (
        <>
            <Link to={`/show/${ids[0]}`}>Back to Show</Link>
            <Episode videoId={id} watchedHistory={history.watched || {}}  next={seasonsMap[ids[0]][ids[1]][id]} />
        </>
    );
};