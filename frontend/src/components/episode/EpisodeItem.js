import { useNavigate } from 'react-router-dom';
import { I, T } from 'components/common';
import a from 'store/actions';

import './styles/EpisodeItem.css';
import { secondsToHHMMSS } from 'libs/formatters';


const EpisodeItem = ({ name, show = null, season = null, fullId, dispatch, watchedHistory = {}, highlightWatched = false }) => {
    const navigate = useNavigate();
    const watched = (Boolean(watchedHistory.time) || Boolean(watchedHistory.finished));
    const setWatched = (watched = true) => dispatch(a.HISTORY.SYNC, { time: watched ? 1 : 0, id: fullId, finished: watched });
    const watch = () => navigate(`/episode/${fullId}`);
    const episodeTitle = `${show ? `${show} - ` : ''}${season ? `${season} - ` : ''}${name}`;
    return (
        <div className={`EpisodeItem-wrapper${watched && highlightWatched ? ' watched' : ''}`}>
            {episodeTitle}
            <div className="actions">
                {!watchedHistory.finished && watchedHistory.total && watched && (
                    <T title={`${secondsToHHMMSS(watchedHistory.time)} / ${secondsToHHMMSS(watchedHistory.total)}`}>
                        <progress max={watchedHistory.total} value={watchedHistory.time} style={{ width: '30px', height: '5px' }} />
                    </T>
                )}
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