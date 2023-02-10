import "../styles/Navbar.css"
import {Link} from 'react-router-dom'
export default function NavBar(){
    return(
        <header className="navBar">
            <div className="title"><Link to="/">Movies Ridge</Link></div>
            <nav>
                <ul className="navItems">
                    <li className="listItem"><Link to="/list">My List</Link></li>
                    <li className="listItem"><Link to="/movies">Movies</Link></li>
                    <li className="listItem">TV Shows</li>
                </ul>
            </nav>
        </header>
    )
}