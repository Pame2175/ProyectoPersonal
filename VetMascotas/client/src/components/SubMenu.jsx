import { NavLink } from "react-router-dom"
import PropTypes from 'prop-types';

const SubMenu = ({children}) => {
    return (
        <div className="container">
            <NavLink to="/movies/list" className="me-3 btn btn-outline-primary mb-2">Lista de peliculas</NavLink>
            <NavLink to="/movies/add" className="btn btn-outline-warning mb-2">Agregar Peliculas</NavLink>
            {children}
        </div>
    )
}

SubMenu.propTypes = {
    children: PropTypes.node
}

export default SubMenu;
