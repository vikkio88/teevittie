import { useEffect } from 'react';
import './styles/Episode.css';
const { REACT_APP_API_URL } = process.env;
const UPDATE_INTERVAL = 5 * 1000;

const Episode = ({ videoId }) => {
    useEffect(() => {
        const video = document.getElementById('video');
        const interval = setInterval(() => console.log(video.currentTime), UPDATE_INTERVAL);
        return () => clearInterval(interval);
    });
    return (
        <div className="Episode-wrapper">
            <video id="video" width="100%" controls>
                <source src={`${REACT_APP_API_URL}/stream/${videoId}`} type="video/mp4" />
            </video>

        </div>
    );
};

export default Episode;