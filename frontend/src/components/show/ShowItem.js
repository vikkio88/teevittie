import { I } from 'components/common';
import './styles/ShowItem.css';

export const ShowItem = ({ name, seasons, onView }) => {
    const seasonsCount = seasons.length;
    return (
        <div className="ShowItem">
            <h3>
                {name}
            </h3>
            <span>{seasonsCount} seasons</span>
            <button onClick={onView}><I name={I.NAMES.CHEV_RIGHT} /></button>
        </div>
    );
};