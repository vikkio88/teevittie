import Episode from 'components/episode/Episode';
import { useParams } from "react-router-dom";
import { useStoreon } from 'storeon/react';

export default () => {
    const { id } = useParams();
    return (
        <>
            <Episode videoId={id} />
        </>
    );
};