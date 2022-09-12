import { useStoreon } from 'storeon/react';
import { useNavigate } from 'react-router-dom';
import { ShowItem } from 'components/show/ShowItem';

const ShowsPage = () => {
    const { app: { catalog } } = useStoreon('app');
    const navigate = useNavigate();
    const folderHasShows = Array.isArray(catalog) && Boolean(catalog.length);
    return (
        <>
            {!folderHasShows && <>
                <h3 className="centered">There are no File Video on the selected folder tree...</h3>
                <h3 className="centered">😢</h3>
            </>}
            {folderHasShows && (<>
                <h1>Shows</h1>
                {catalog.map(s => (
                    <ShowItem key={s.id} {...s} onView={() => navigate(`/show/${s.id}`)} />
                ))}
            </>
            )}
        </>
    );
};

export default ShowsPage;