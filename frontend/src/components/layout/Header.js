import { Link } from 'react-router-dom';
import './styles/Header.css';

import gh from 'assets/gh.svg';

const Header = ({ version }) => {
    return (
        <header>
            <Link to='/'><h1 className="logo" >📺-ttie</h1></Link>
            <small>{version}</small>
            <div className="credits">
                <a href="https://github.com/vikkio88/teevittie" target="_blank" rel="noreferrer">
                    <img width="50px" src={gh} alt="Github" />
                </a>
            </div>
        </header>
    );
};

export default Header;