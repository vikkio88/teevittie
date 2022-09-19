import { useNavigate } from 'react-router-dom';
import { I, T } from 'components/common';
import a from 'store/actions';

import './styles/EpisodeItem.css';
import { secondsToHHMMSS } from 'libs/formatters';


const EpisodeItem = ({ name, subs = null, show = null, season = null, fullId, dispatch, watchedHistory = {}, highlightWatched = false, ...rest }) => {
    const navigate = useNavigate();
    const watched = (Boolean(watchedHistory.time) || Boolean(watchedHistory.finished));
    const setWatched = (watched = true) => dispatch(a.HISTORY.SYNC, { time: watched ? 1 : 0, id: fullId, finished: watched });
    const watch = () => navigate(`/episode/${fullId}`);
    // this is to show more info in case you are in the Main Page, we dont highlight in main page
    const episodeTitle = highlightWatched ? name : `${show ? `${show} - ` : ''}${season ? `${season} - ` : ''}${name}`;
    return (
        <div className={`EpisodeItem-wrapper${watched && highlightWatched ? ' watched' : ''}`}>
            {episodeTitle} {Boolean(subs) ? <T title="Subtitles"><I name={I.NAMES.CC} /></T> : ''}
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