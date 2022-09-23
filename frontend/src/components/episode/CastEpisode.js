import api from "api";

const CastEpisode = ({ videoId, season, show, name, subs = null, next, watchedHistory }) => {
    return (
        <>
            <h2>{show}</h2>
            <h3>{name}</h3>

            <button onClick={() => { api.cast.play(videoId); }}>PLAY</button>
            <button onClick={() => { api.cast.pause(); }}>PAUSE</button>
            <button onClick={() => { api.cast.resume(); }}>RESUME</button>

        </>
    );
};

export default CastEpisode;