import { Spinner } from 'components/common';
import { useParams } from "react-router-dom";
import { useStoreon } from 'storeon/react';
import { catalogHelper } from 'libs/helpers';

import CastEpisode from 'components/episode/CastEpisode';

const EpisodeCastPage = () => {
    const { id } = useParams();
    const { app: { history, seasonsMap, catalog } } = useStoreon('app');
    const ids = id.split('.');

    if (!history || !catalog) return <Spinner />;
    const { season, show, name, subs = null } = catalogHelper.getEpisodeById(id, catalog);

    return <CastEpisode
        {...{ season, show, name, subs }}
        videoId={id}
        watchedHistory={history.watched || {}}
        next={seasonsMap[ids[0]][ids[1]][id]}
    />;
};

export default EpisodeCastPage;