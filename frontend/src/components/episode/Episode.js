import { useEffect, useState } from 'react';
import { useStoreon } from 'storeon/react';
import { Link } from "react-router-dom";
import TimeAgo from 'javascript-time-ago';
import a from 'store/actions';
import './styles/Episode.css';
import { secondsToHHMMSS } from 'libs/formatters';
import api from 'api';
import { I, T } from 'components/common';

const UPDATE_INTERVAL = 5 * 1000;
const FINISHED_LEEWAY = .95;

const syncHistory = (video, { videoId, info }, dispatch, setWatched) => () => {
    const { currentTime, duration, paused } = video;
    const isFinished = currentTime >= duration * FINISHED_LEEWAY;
    if (isFinished) setWatched({ justFinished: true });
    if (paused) return;
    dispatch(a.HISTORY.SYNC, { time: video.currentTime, total: video.duration, id: videoId, info, finished: isFinished });
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

const Episode = ({ videoId, season, show, name, subs = null, next, watchedHistory }) => {
    const { dispatch } = useStoreon();
    const [showId] = videoId.split('.');

    const nextEpisode = () => window.location.href = `/episode/${next}`;
    const [watched, setWatched] = useState(null); //{ time: 0, isFinished: false, timestamp, justFinished }
    useEffect(() => {
        const video = document.getElementById('video');
        const interval = setInterval(syncHistory(video, { videoId, info: { name, show, season } }, dispatch, setWatched), UPDATE_INTERVAL);
        checkIfInHistory(watchedHistory, videoId, setWatched);
        return () => clearInterval(interval);
        // eslint-disable-next-line
    }, [videoId, subs]);
    return (
        <div className="Episode-wrapper">
            {watched?.isFinished && (
                <div className="fullRow">
                    <T title="Reset">
                        <button onClick={() => continueWatching(0)}><I name={I.NAMES.BACK_STEP} /></button>
                    </T>
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
                <T title="Reset">
                    <button onClick={() => continueWatching(0)}><I name={I.NAMES.BACK_STEP} /></button>
                </T>
                <button onClick={() => continueWatching(watched.time)}>Continue from {secondsToHHMMSS(watched.time)}</button>
            </div>}
            <video id="video" width="80%" controls onPlay={playPauseIntercept(setWatched)}>
                <source src={`${api.streamUrl(videoId)}`} type="video/mp4" />
                {Boolean(subs) && <track src={api.subs.urlFromVideoId(videoId)} label="English" kind="subtitles" srcLang="en" ></track>}
            </video>
            {/* NEED TO STYLE THIS BETTER */}
            <div className="bottomRow">
                <T title={`Back to ${show}`}>
                    <Link to={`/show/${showId}`}><I name={I.NAMES.LIST} /></Link>
                </T>
                <small>{name} ({show} - {season})</small>
                <div className="controls">
                    <T title="Reset">
                        <button onClick={() => continueWatching(0)}><I name={I.NAMES.BACK_STEP} /></button>
                    </T>
                    <T title="Rewind 15 seconds">
                        <button onClick={() => seek(-15)}><I name={I.NAMES.CLOCK_ROTATE_LEFT} /></button>
                    </T>
                </div>
                {/* NEED TO CHECK HOW TO DO PLAY PAUSE WITHOUT TOO MUCH SET STATE */}
                {/* <button onClick={() => togglePlay()}><I name={I.NAMES.CLOCK_ROTATE_LEFT} /></button> */}
            </div>

        </div>
    );
};

export default Episode;