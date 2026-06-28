import React, { useEffect, useState } from 'react'
import NavBar from '../components/navBar';
import HomeFront from '../components/HomeFront';
import Features from '../components/home/features';
import Stats from '../components/home/Stats';
import Property from '../components/home/Property';
import Details from '../components/home/Details';
import Author from '../components/home/Author';
import Footer from '../components/footer';
import { useContext } from 'react';
import { AuthContext } from '../Helpers/AuthContext';
import { Snackbar, Alert } from '@mui/material';
import MapBox from '../components/home/MapBox';
function Home() {
    const { user, setUser, loginSuccess, setLoginSuccess, setAlert, setAlertMessage, setAlertType, url } = useContext(AuthContext);
    const handleClose = () => {
        setLoginSuccess(false);
    }
    return (
        <div>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={loginSuccess}
                autoHideDuration={3000}
                onClose={handleClose}
                key={'top' + 'center'}
            >
                <Alert
                    onClose={handleClose}
                    severity="success"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    Welcome.. , You successfully logged in... !!!!
                </Alert>
            </Snackbar>
            <AuthContext.Provider value={{ setAlert, setAlertMessage, setAlertType, url }}>
                <HomeFront />
                <MapBox />
                <Features />
                <Stats />
                <Property />
                <Details />
                <Author />
            </AuthContext.Provider>
        </div>
    )
}

export default Home;