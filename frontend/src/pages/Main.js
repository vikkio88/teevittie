import { useStoreon } from 'storeon/react';
import { useNavigate } from 'react-router-dom';
import { Shows } from 'components/show';
import EpisodeItem from 'components/episode/EpisodeItem';

const MainPage = () => {
    const { dispatch, app: { catalog, history } } = useStoreon('app');
    const navigate = useNavigate();
    return (
        <>
            {history.latest.length && (
                <>
                    <h2>Keep Watching</h2>
                    {history.latest.map(e => <EpisodeItem key={e.id} {...e.info} watchedHistory={{ ...e }} dispatch={dispatch} />)}
                </>
            )}
            <Shows {...{ navigate, catalog }} />
        </>
    );

};

export default MainPage;