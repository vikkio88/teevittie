import { Tooltip as Tippy } from 'react-tippy';

const Tooltip = ({ title, children, ...rest }) => {
    return <Tippy title={title} {...rest}>{children}</Tippy>;
};

export default Tooltip;