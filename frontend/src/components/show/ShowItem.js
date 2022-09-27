import { I } from 'components/common';
import './styles/ShowItem.css';

export const ShowItem = ({ name, seasons, movies = null, onView }) => {
    const seasonsCount = seasons?.length ?? 0;
    const hasStrayVideo = seasonsCount < 1 && (movies?.length ?? false);
    return (
        <div className="ShowItem">
            <h4>
                {name}
                {hasStrayVideo && <I style={{ marginLeft: '6px' }} name={I.NAMES.FOLDERS} />}
            </h4>
            <div>
                {!hasStrayVideo && <span>{seasonsCount} season{`${seasonsCount > 1 ? 's' : ''}`}</span>}
                <button onClick={onView}><I name={I.NAMES.CHEV_RIGHT} /></button>
            </div>
        </div>
    );
};