import { useState } from 'react';
import { useStoreon } from 'storeon/react';
import a from 'store/actions';

import { I, T } from 'components/common';
import EpisodeItem from 'components/episode/EpisodeItem';
import './styles/Season.css';


const Season = ({ name, episodes }) => {
    const [open, setOpen] = useState(false);
    const { dispatch, app: { history } } = useStoreon('app');
    const episodesIds = { nonWatched: [], all: [] };
    let watched = 0;
    for (const { fullId } of episodes) {
        if (history.watched[fullId]?.finished ?? false) {
            watched++;
        } else {
            episodesIds.nonWatched.push(fullId);
        }
        episodesIds.all.push(fullId);
    }
    const allEpisodes = episodes.length;
    const allWatched = watched === allEpisodes;
    const toggleWatchedOnAllEpisodes = event => {
        event.stopPropagation();
        dispatch(a.HISTORY.PATCH, { ids: allWatched ? episodesIds.all : episodesIds.nonWatched, finished: !allWatched });
    };

    return (
        <>
            <div onClick={() => setOpen(!open)} className="SeasonHead">
                <h3>
                    {name}
                </h3>
                <div>
                    {watched} / {allEpisodes}
                    <T title={`${allWatched ? 'Reset Progress' : 'Mark all as Watched'}`}>
                        <button onClick={toggleWatchedOnAllEpisodes}>
                            <I name={allWatched ? I.NAMES.X : I.NAMES.CHECK} />
                        </button>
                    </T>
                </div>
                <I name={open ? I.NAMES.CHEV_UP : I.NAMES.CHEV_DOWN} />
            </div>
            <div className={`Episodes${open ? ' Episodes-active' : ''}`}>
                {episodes.map(e => (
                    <EpisodeItem
                        key={e.fullId}
                        dispatch={dispatch}
                        watchedHistory={history ? (history.watched[e.fullId] || {}) : {}}
                        {...e}
                        highlightWatched
                    />
                )
                )}
            </div>
        </>
    );
};

export default Season;