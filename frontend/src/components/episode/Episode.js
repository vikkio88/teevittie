import { useEffect } from 'react';
import './styles/Episode.css';
const { REACT_APP_API_URL } = process.env;
// const timeUpdateHandler = ({ target }) => {
//     console.log('time update:', target.currentTime);
// };

const Episode = ({ videoId }) => {
    // useEffect(() => {
    //     const video = document.getElementById('video');
    //     video.addEventListener('timeupdate', timeUpdateHandler);
    //     return () => video.removeEventListener('timeupdate', timeUpdateHandler);
    // });
    useEffect(() => {
        const video = document.getElementById('video');
        const interval = setInterval(() => console.log(video.currentTime), 5000);
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