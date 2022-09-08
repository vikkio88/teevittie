
import {
    faCheck, faChevronDown,
    faChevronUp, faPlay, faXmark,
    faClockRotateLeft, faBackwardStep,
    faPause
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon as FaIcon } from '@fortawesome/react-fontawesome';

const NAMES = {
    CHECK: 'check',
    X: 'x',
    CHEV_UP: 'chev_up',
    CHEV_DOWN: 'chev_down',
    PLAY: 'play',
    PAUSE: 'pause',
    CLOCK_ROTATE_LEFT: 'clock_rotate_left',
    BACK_STEP: 'back_step',
};
const NAMES_MAP = {
    [NAMES.CHECK]: faCheck,
    [NAMES.X]: faXmark,
    [NAMES.CHEV_UP]: faChevronUp,
    [NAMES.CHEV_DOWN]: faChevronDown,
    [NAMES.PLAY]: faPlay,
    [NAMES.PAUSE]: faPause,
    [NAMES.CLOCK_ROTATE_LEFT]: faClockRotateLeft,
    [NAMES.BACK_STEP]: faBackwardStep,

};

const Icon = ({ name }) => {
    return <FaIcon icon={NAMES_MAP[name]} />;
};

Icon.NAMES = NAMES;

export default Icon;