import { Link } from 'react-router-dom';
import './styles/EpisodeItem.css';

const EpisodeItem = ({ name, showId, seasonId, id }) => {
    return (
        <div className="EpisodeItem-wrapper">
            {name}
            <Link to={`/episode/${showId}.${seasonId}.${id}`}>Watch</Link>
        </div>
    );
};

export default EpisodeItem;