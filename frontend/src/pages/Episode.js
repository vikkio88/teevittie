import { Spinner } from 'components/common';
import Episode from 'components/episode/Episode';
import { useParams } from "react-router-dom";
import { useStoreon } from 'storeon/react';

const EpisodePage = () => {
    const { id } = useParams();
    const { app: { history, seasonsMap } } = useStoreon('app');
    if (!history) return <Spinner />;

    const ids = id.split('.');
    return <Episode videoId={id} watchedHistory={history.watched || {}} next={seasonsMap[ids[0]][ids[1]][id]} />;
};

export default EpisodePage;