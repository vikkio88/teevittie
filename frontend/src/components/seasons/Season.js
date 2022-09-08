import { useState } from 'react';
import { I } from 'components/common';
import EpisodeItem from 'components/episode/EpisodeItem';
import './styles/Season.css';
import { useStoreon } from 'storeon/react';


const Season = ({ name, episodes }) => {
    const [open, setOpen] = useState(false);
    const { dispatch, app: { history } } = useStoreon('app');
    return (
        <>
            <div onClick={() => setOpen(!open)} className="SeasonHead">{name} <I name={open ? I.NAMES.CHEV_UP : I.NAMES.CHEV_DOWN} /></div>
            <div className={`Episodes${open ? ' Episodes-active' : ''}`}>
                {episodes.map(e => (
                    <EpisodeItem
                        key={e.id}
                        dispatch={dispatch}
                        watchedHistory={history ? (history.watched[e.fullId] || {}) : {}}
                        {...e}
                    />
                )
                )}
            </div>
        </>
    );
};

export default Season;