import { Link, NavLink, useNavigate } from "react-router-dom"
import axios from "axios";
import { useContext } from "react";
import UserContext from '../context/UserContext';

const NavBar = () => {
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logoutUser();
    };

    const logoutUser = async () => {
        try {
            await axios.post("http://localhost:8000/api/auth/logout",
                { withCredentials: true }
            );
            localStorage.removeItem("user");
            setUser(null)
            navigate("/login")
        } catch (err) {
            console.log("Error: ", err)
        }
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-info">
            <div className="container">
                <Link className="navbar-brand" to="/mascota/infoVeterinaria">Mascotas</Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <NavLink to="/mascota/list" className="nav-link ">Lista de Mascotas</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/mascota/add" className="nav-link">Agendar Ficha de Mascota</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/mascota/citas" className="nav-link">Lista de Citas</NavLink>
                        </li>
                    </ul>
                </div>
                <div className="navbar-nav ml-auto">
                    <button onClick={handleLogout} className="btn btn-outline-danger my-2 my-sm-0" type="button">Salir</button>
                </div>
            </div>
        </nav>
    )
}

export default NavBar