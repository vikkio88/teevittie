import Season from 'components/seasons/Season';
import EpisodeItem from 'components/episode/EpisodeItem';
import './styles/Show.css';

const Show = ({ id, name, seasons, movies = null, history, dispatch }) => {
    const seasonsCount = seasons?.length ?? 0;
    const hasStrayVideo = seasonsCount < 1 && (movies?.length ?? false);
    return (
        <div className="Show-wrapper">
            <h3>
                {name}
                EpisodeItem
            </h3>

            {hasStrayVideo && <div className='Movies-wrapper'>
                {movies.map(e => <EpisodeItem key={e.id} fullId={e.id} {...e} watchedHistory={history?.watched?.[e.fullId] ?? {}} dispatch={dispatch} highlightWatched />)}
            </div>}
            {!hasStrayVideo && <div className='Show-seasonsWrapper'>
                {seasons.map(s => <Season key={s.id} {...s} showId={id} />)}
            </div>}
        </div>
    );
};

export default Show;