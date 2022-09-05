import { useStoreon } from 'storeon/react';
import { useNavigate } from 'react-router-dom';
import { ShowItem } from 'components/show/ShowItem';

export default () => {
    const { app: { catalog } } = useStoreon('app');
    const navigate = useNavigate();
    return (
        <>
            <h1>Shows</h1>
            {Array.isArray(catalog) && catalog.map(s => (
                <ShowItem key={s.id} {...s} onView={() => navigate(`/show/${s.id}`)} />
            ))}
        </>
    );
};