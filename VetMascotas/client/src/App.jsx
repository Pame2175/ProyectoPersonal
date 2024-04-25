import React, { useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import ListMascota from './views/ListMascota';
import AddMascotas from './views/AddMascotas';
import Container from './components/Contenedor';
import LoginRegister from './views/LoginRegister';
import UserContext from './context/UserContext';
import PublicRoute from './components/PublicRoute';
import PrivateRoute from './components/PrivateRoute';
import EditMascotas from './views/EditMascota';
import AgendarMascotas from './views/AgendarMascotas';
import InfoVeterinaria from './views/InfoVeterinaria';
import Register from './views/Register';
import VerCitas  from './views/VerCitas';
import EditarCitas  from './views/EditarCitas';


const App = () => {
    const userDetails = JSON.parse(localStorage.getItem("user"));
    const userInfo = userDetails ? userDetails : null;
    const [user, setUser] = useState(userInfo)

    const setUserKeyValue = (key, value) => {
        setUser({ ...user, [key]: value })
    }

    const contextObject = {
        user,
        setUser,
        setUserKeyValue
    }

    return (
        <UserContext.Provider value={contextObject}>
            <Routes>
                <Route path="/" element={<Navigate to="/mascota/list" />} />
                <Route path="/login" element={
                    <PublicRoute>
                        <LoginRegister />
                    </PublicRoute>
                    
                } />
                 <Route path="/register" element={
                    <PublicRoute>
                        <Register />
                    </PublicRoute>
                    
                } />
                <Route path="/mascota/" element={
                    <PrivateRoute>
                        <Container />
                    </PrivateRoute>
                }>
                    <Route path="list" element={<ListMascota />} />
                    <Route path="add" element={<AddMascotas />} />
                    <Route path="citas" element={<VerCitas />} />
                    <Route path="cita/edit/:citaId" element={<EditarCitas/>} />
                    <Route path="editar/:id" element={<EditMascotas />} />
                    <Route path="cita/:id" element={<AgendarMascotas />} />
                    <Route path="infoVeterinaria" element={< InfoVeterinaria />} />
                    
                </Route>
                
                
                
            </Routes>
        </UserContext.Provider>
    )
};

export default App;
