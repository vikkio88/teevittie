import { Spinner } from 'components/common';
import { useParams } from "react-router-dom";
import { useStoreon } from 'storeon/react';
import { catalogHelper } from 'libs/helpers';

import Episode from 'components/episode/Episode';

const EpisodePage = () => {
    const { id } = useParams();
    const { app: { history, seasonsMap, catalog } } = useStoreon('app');
    const ids = id.split('.');

    if (!history || !catalog) return <Spinner />;
    const { season, show, name, subs = null } = catalogHelper.getEpisodeById(id, catalog);

    const isStandalone = ids.length < 3;

    return <Episode
        {...{ season, show, name, subs }}
        next={isStandalone ? null : seasonsMap[ids[0]][ids[1]][id]}
        videoId={id}
        watchedHistory={history.watched || {}}
    />;
};

export default EpisodePage;