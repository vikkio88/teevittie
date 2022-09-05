import { useState } from 'react';
import EpisodeItem from 'components/episode/EpisodeItem';
import './styles/Season.css';


const Season = ({ name, episodes, watchedHistory = {} }) => {
    const [open, setOpen] = useState(false);
    return (
        <>
            <div onClick={() => setOpen(!open)} className="SeasonHead">{name}</div>
            <div className={`Episodes${open ? ' Episodes-active' : ''}`}>
                {episodes.map(e => <EpisodeItem key={e.id} {...e} watched={(watchedHistory[e.fullId]?.time || 0) > 0} />)}
            </div>
        </>
    );
};

export default Season;