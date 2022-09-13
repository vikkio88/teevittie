import { ShowItem } from 'components/show/ShowItem';

const Shows = ({ catalog, navigate }) => {
    const folderHasShows = Array.isArray(catalog) && Boolean(catalog.length);
    return (
        <>
            {!folderHasShows && <>
                <h3 className="centered">There are no File Video on the selected folder tree...</h3>
                <h3 className="centered">😢</h3>
            </>}
            {folderHasShows && (
                <>
                    <h1>Shows</h1>
                    <div className="Shows-wrapper">
                        {catalog.map(s => (
                            <ShowItem key={s.id} {...s} onView={() => navigate(`/show/${s.id}`)} />
                        ))}
                    </div>
                </>
            )}
        </>
    );
};

export default Shows;