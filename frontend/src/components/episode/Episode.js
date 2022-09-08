import { useEffect, useState } from 'react';
import { useStoreon } from 'storeon/react';
import TimeAgo from 'javascript-time-ago';
import a from 'store/actions';
import './styles/Episode.css';
import { secondsToHHMMSS } from 'libs/formatters';
import api from 'api';
import { I } from 'components/common';

const UPDATE_INTERVAL = 5 * 1000;
const FINISHED_LEEWAY = .7;

const syncHistory = (video, videoId, dispatch, setWatched) => () => {
    const { currentTime, duration, paused } = video;
    const isFinished = currentTime >= duration * FINISHED_LEEWAY;
    if (isFinished) setWatched({ justFinished: true });
    if (paused) return;
    dispatch(a.HISTORY.SYNC, { time: video.currentTime, id: videoId, finished: isFinished });
};

const checkIfInHistory = (watchedHistory, videoId, setWatched) => {
    if (watchedHistory[videoId] && watchedHistory[videoId].time > 0) {
        const { time, finished: isFinished } = watchedHistory[videoId];
        let timestamp = watchedHistory[videoId].timestamp || null;
        if (Boolean(timestamp)) timestamp = new Date(timestamp);

        setWatched({ time, isFinished, timestamp });
    }
};

const playPauseIntercept = setWatched => event => {
    // const video = event.target;
    setWatched(null);
};

const continueWatching = time => {
    const video = document.getElementById('video');
    video.currentTime = time;
    video.play();
};

const seek = diff => {
    const video = document.getElementById('video');
    video.pause();
    video.currentTime += diff;
    video.play();
};

const Episode = ({ videoId, next, watchedHistory }) => {
    const { dispatch } = useStoreon();
    const nextEpisode = () => window.location.href = `/episode/${next}`;
    const [watched, setWatched] = useState(null); //{ time: 0, isFinished: false, timestamp, justFinished }
    useEffect(() => {
        const video = document.getElementById('video');
        const interval = setInterval(syncHistory(video, videoId, dispatch, setWatched), UPDATE_INTERVAL);
        checkIfInHistory(watchedHistory, videoId, setWatched);
        return () => clearInterval(interval);
        // eslint-disable-next-line
    }, [videoId]);
    return (
        <div className="Episode-wrapper">
            {watched?.isFinished && (
                <div className="fullRow">
                    <button onClick={() => continueWatching(0)}><I name={I.NAMES.BACK_STEP} /></button>
                    Watched {watched?.timestamp ? (new TimeAgo()).format(watched.timestamp) : ''}
                </div>
            )}

            {watched?.justFinished && (
                <div className="fullRow">
                    {Boolean(next) && <button onClick={nextEpisode}>Next Episode</button>}
                    {!Boolean(next) && <h3>No more Episodes</h3>}
                    {/* 
                    I need to find and merge the seasons too so I can go next from Episode of a season to the next
                    maybe it is as easy as moving the temporary lastEpisode outside the season
                     */}
                </div>
            )}

            {watched?.time && !watched?.isFinished && <div className="fullRow">
                <button onClick={() => continueWatching(0)}><I name={I.NAMES.BACK_STEP} /></button>
                <button onClick={() => continueWatching(watched.time)}>Continue from {secondsToHHMMSS(watched.time)}</button>
            </div>}
            {/* MAYBE COULD STYLE THIS ALSO BETTER */}
            <video id="video" width="80%" controls onPlay={playPauseIntercept(setWatched)}>
                <source src={`${api.streamUrl(videoId)}`} type="video/mp4" />
            </video>
            {/* NEED TO STYLE THIS BETTER */}
            <div className="bottomRow">
                <button onClick={() => continueWatching(0)}><I name={I.NAMES.BACK_STEP} /></button>
                <button onClick={() => seek(-15)}><I name={I.NAMES.CLOCK_ROTATE_LEFT} /></button>
                {/* NEED TO CHECK HOW TO DO PLAY PAUSE WITHOUT TOO MUCH SET STATE */}
                {/* <button onClick={() => togglePlay()}><I name={I.NAMES.CLOCK_ROTATE_LEFT} /></button> */}
            </div>

        </div>
    );
};

export default Episode;