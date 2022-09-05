import { useState } from 'react';
import EpisodeItem from 'components/episode/EpisodeItem';
import './styles/Season.css';


const Season = ({ name, episodes }) => {
    const [open, setOpen] = useState(false);
    return (
        <>
            <div onClick={() => setOpen(!open)} className="SeasonHead">{name}</div>
            <div className={`Episodes${open ? ' Episodes-active' : ''}`}>
                {episodes.map((e, i) => <EpisodeItem key={i} {...e} />)}
            </div>
        </>
    );
};

export default Season;