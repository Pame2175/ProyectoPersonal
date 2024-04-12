import React, { useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import ListMovies from './views/ListMovie';
import AddMovie from './views/AddMovie';
import Addreview from './views/addreview';
import Container from './components/Contenedor';
import LoginRegister from './views/LoginRegister';
import UserContext from './context/UserContext';
import PublicRoute from './components/PublicRoute';
import PrivateRoute from './components/PrivateRoute';
import MovieDetails from './views/MovieDetail';
import SeeReview from './views/SeeReview';

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
                <Route path="/" element={<Navigate to="/movies/list" />} />
                <Route path="/login" element={
                    <PublicRoute>
                        <LoginRegister />
                    </PublicRoute>
                } />
                <Route path="/movies/" element={
                    <PrivateRoute>
                        <Container />
                    </PrivateRoute>
                }>
                    <Route path="list" element={<ListMovies />} />
                    <Route path="add" element={<AddMovie />} />
                    <Route path="add" element={<AddMovie />} />
                    <Route path="addreview/:movieId" element={<Addreview/>} />
                    <Route path="seereview/:movieId" element={<SeeReview />} />
                </Route>
                <Route path="/movies/:movieId" element={<MovieDetails />} />
            </Routes>
        </UserContext.Provider>
    )
};

export default App;
