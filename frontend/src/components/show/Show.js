import Season from 'components/seasons/Season';
import './styles/Show.css';

const Show = ({ id, name, seasons, watchedHistory }) => {
    return (
        <div className="Show-wrapper">
            <h3>
                {name}
            </h3>
            <div className='Show-seasonsWrapper'>
                {seasons.map((s, i) => <Season watchedHistory={watchedHistory} key={i} {...s} showId={id} />)}
            </div>
        </div>
    );
};

export default Show;