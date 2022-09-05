import { Link } from 'react-router-dom';
import './styles/EpisodeItem.css';

const EpisodeItem = ({ name, fullId, watched = false }) => {
    return (
        <div className={`EpisodeItem-wrapper${watched ? ' watched' : ''}`}>
            {name}
            <Link to={`/episode/${fullId}`}>Watch</Link>
        </div>
    );
};

export default EpisodeItem;