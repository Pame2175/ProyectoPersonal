import { NavLink, Outlet } from 'react-router-dom'
import NavBar from './NavBar'

const Contenedor = () => {
    return (
        <>
            <NavBar />
            <div className='container mt-3'>
            
                <Outlet />
            </div>
        </>

    )
}

export default Contenedor