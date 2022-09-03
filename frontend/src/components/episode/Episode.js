import './styles/Episode.css';
const { REACT_APP_API_URL } = process.env;

const Episode = ({videoId}) => {
    return (
        <div className="Episode-wrapper">
            <video width="100%" controls  autoplay>
                <source src={`${REACT_APP_API_URL}/stream/${videoId}`} type="video/mp4" />
            </video>

        </div>
    );
};

export default Episode;