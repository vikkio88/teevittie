import { Link } from 'react-router-dom';
import './styles/Header.css';

import gh from 'assets/gh.svg';

const Header = () => {
    return (
        <header>
            <Link to='/'><h1 className="logo" >📺-ttie</h1></Link>
            <div className="credits">
                <a href="https://github.com/vikkio88/teevittie" target="_blank">
                    <img width="50px" src={gh} alt="Github" />
                </a>
            </div>
        </header>
    );
};

export default Header;