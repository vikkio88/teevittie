import { Link } from 'react-router-dom';
import './styles/EpisodeItem.css';

const EpisodeItem = ({ name, fullId }) => {
    return (
        <div className="EpisodeItem-wrapper">
            {name}
            <Link to={`/episode/${fullId}`}>Watch</Link>
        </div>
    );
};

export default EpisodeItem;