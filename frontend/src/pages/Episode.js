import { Spinner } from 'components/common';
import Episode from 'components/episode/Episode';
import { useParams } from "react-router-dom";
import { useStoreon } from 'storeon/react';

const EpisodePage = () => {
    const { id } = useParams();
    const { app: { history, seasonsMap, catalog } } = useStoreon('app');
    const ids = id.split('.');

    if (!history || !catalog) return <Spinner />;
    // move this crap somewhere else, maybe rendindex folder too and serve that
    const { season, show, name } = catalog.find(s => s.id === ids[0])?.seasons?.find(s => s.id === ids[1])?.episodes.find(e => e.id === ids[2]);
    //

    return <Episode {...{ season, show, name }} videoId={id} watchedHistory={history.watched || {}} next={seasonsMap[ids[0]][ids[1]][id]} />;
};

export default EpisodePage;