import React, { useState, useContext } from 'react';
import password from "../assets/authentication/password.svg";
import user from "../assets/authentication/user.svg";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Alert } from '@mui/material';
import { AuthContext } from '../Helpers/AuthContext';
import { jwtDecode } from "jwt-decode";


function Login() {
    const { setUser, setLoginSuccess, notLoggedIn, setNotLoggedIn, url } = useContext(AuthContext);
    const navigate = useNavigate();
    const [alert, setAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState(null);

    const handleLogin = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            username: formData.get('username'),
            password: formData.get('password')
        };
        axios.post(`${url}/login`, data).then((response) => {
            if (!response.data.error) {
                localStorage.setItem('accessToken', response.data);
                setUser(response.data);
                setLoginSuccess(true);
                navigate("/");
            } else {
                setAlertMessage(response.data.error);
                setAlert(true);
            }
        });
    };

    const handleLoginSuccess = (res) => {
        console.log("logged in = ", jwtDecode(res.credential));
    };

    const handleLoginError = (res) => {
        console.log("failure = ", res);
    };

    return (
        <div className='flex flex-col items-center justify-center min-h-screen bg-white p-4'>
            {alert && (
                <div className='w-full max-w-md mb-4'>
                    <Alert severity="error" variant="filled" onClose={() => { setAlert(false); }}>
                        {alertMessage}
                    </Alert>
                </div>
            )}
            {notLoggedIn && (
                <div className='w-full max-w-md mb-4'>
                    <Alert severity="error" variant="filled" onClose={() => { setNotLoggedIn(false); }}>
                        You must Log-In first... !!
                    </Alert>
                </div>
            )}
            <div className='w-full max-w-md border border-black p-5 rounded-xl flex flex-col gap-5 bg-white shadow-lg'>
                <p className='font-bold text-2xl md:text-3xl'>Log in</p>
                <form onSubmit={handleLogin} className='flex flex-col gap-5 pb-10 border-b border-black'>
                    <div className='relative'>
                        <img src={user} alt="User Icon" className='absolute right-3 bottom-3 w-5 md:w-6' />
                        <input
                            name="username"
                            type="text"
                            placeholder='Username'
                            className='rounded-xl w-full px-10 py-3 border border-black'
                        />
                    </div>
                    <div className='relative'>
                        <img src={password} alt="Password Icon" className='absolute right-3 bottom-3 w-5 md:w-6' />
                        <input
                            name="password"
                            type="password"
                            placeholder='Password'
                            className='rounded-xl w-full px-10 py-3 border border-black'
                        />
                    </div>
                    <button
                        type="submit"
                        className='bg-black text-white rounded-xl py-3 font-semibold text-lg w-full'
                    >
                        Log In
                    </button>
                </form>
                <p className='text-gray-600 text-xl text-center'>
                    Don't have an account?{' '}
                    <Link to="/signup" className='text-blue-600 font-semibold'>
                        Create Account
                    </Link>
                </p>
                <p className='text-gray-600 text-xl text-center'>
                    Sign in as a member: {' '}
                    <Link to="/loginMember" className='text-blue-600 font-semibold'>
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
