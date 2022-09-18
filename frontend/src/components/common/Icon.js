
import {
    faCheck, faChevronDown,
    faChevronUp, faPlay, faXmark,
    faClockRotateLeft, faBackwardStep,
    faPause, faRectangleList, faChevronRight,
    faChevronLeft, faClosedCaptioning,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon as FaIcon } from '@fortawesome/react-fontawesome';

const NAMES = {
    CHECK: 'check',
    X: 'x',
    CHEV_UP: 'chev_up',
    CHEV_DOWN: 'chev_down',
    CHEV_RIGHT: 'chev_right',
    CHEV_LEFT: 'chev_left',
    PLAY: 'play',
    PAUSE: 'pause',
    CLOCK_ROTATE_LEFT: 'clock_rotate_left',
    BACK_STEP: 'back_step',
    LIST: 'list',
    CC: 'cc',
};
const NAMES_MAP = {
    [NAMES.CHECK]: faCheck,
    [NAMES.X]: faXmark,
    [NAMES.CHEV_UP]: faChevronUp,
    [NAMES.CHEV_DOWN]: faChevronDown,
    [NAMES.CHEV_RIGHT]: faChevronRight,
    [NAMES.CHEV_LEFT]: faChevronLeft,
    [NAMES.PLAY]: faPlay,
    [NAMES.PAUSE]: faPause,
    [NAMES.CLOCK_ROTATE_LEFT]: faClockRotateLeft,
    [NAMES.BACK_STEP]: faBackwardStep,
    [NAMES.LIST]: faRectangleList,
    [NAMES.CC]: faClosedCaptioning,

};

const Icon = ({ name }) => {
    return <FaIcon icon={NAMES_MAP[name]} />;
};

Icon.NAMES = NAMES;

export default Icon;