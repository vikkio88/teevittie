import { useNavigate } from 'react-router-dom';
import { I, T } from 'components/common';
import a from 'store/actions';

import './styles/EpisodeItem.css';


const EpisodeItem = ({ name, fullId, dispatch, watchedHistory = {} }) => {
    const navigate = useNavigate();
    const watched = Boolean(watchedHistory.time) || Boolean(watchedHistory.finished);
    const setWatched = (watched = true) => dispatch(a.HISTORY.SYNC, { time: watched ? 1 : 0, id: fullId, finished: watched });
    const watch = () => navigate(`/episode/${fullId}`);
    return (
        <div className={`EpisodeItem-wrapper${watched ? ' watched' : ''}`}>
            {name}
            <div className="actions">
                {!watched && <T title="Mark As Watched">
                    <button onClick={() => setWatched()}><I name={I.NAMES.CHECK} /></button>
                </T>}
                {watched && <T title="Reset Progress">
                    <button onClick={() => setWatched(false)}><I name={I.NAMES.X} /></button>
                </T>}
                <button onClick={watch}><I name={I.NAMES.PLAY} /></button>
            </div>
        </div>
    );
};

export default EpisodeItem;