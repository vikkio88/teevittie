import './styles/ShowItem.css';

export const ShowItem = ({ name, seasons, onView }) => {
    const seasonsCount = seasons.length;
    return (
        <div className="ShowItem">
            <h3>
                {name}
            </h3>
            <span>{seasonsCount} seasons</span>
            <button onClick={onView}>View</button>
        </div>
    );
};