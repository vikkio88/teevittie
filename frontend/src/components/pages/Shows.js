import { useStoreon } from 'storeon/react';
import { ShowItem } from 'components/show/ShowItem';

export default ({ history }) => {
    const { app: { catalog } } = useStoreon('app');
    return (
        <>
            {Array.isArray(catalog) && catalog.map(s => (
                <ShowItem key={s.id} {...s} onView={() => history.push(`/show/${s.id}`)} />
            ))}
        </>
    );
};