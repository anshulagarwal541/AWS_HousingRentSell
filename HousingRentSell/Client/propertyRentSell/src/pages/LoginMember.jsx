import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Alert } from '@mui/material';
import password from "../assets/authentication/password.svg";
import user from "../assets/authentication/user.svg";
import { AuthContext } from "../Helpers/AuthContext";

function LoginMember() {
    const { setMember, setLoginSuccess, url } = useContext(AuthContext);
    const navigate = useNavigate();
    const [alert, setAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState(null);

    const handleLogin = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            memberId: formData.get('memberId'),
            pin: formData.get('pin')
        };
        axios.post(`${url}/memberLogin`, data).then((response) => {
            if (!response.data.error) {
                localStorage.setItem('accessMemberToken', response.data);
                setMember(response.data); // Store response data if needed
                setLoginSuccess(true);
                navigate("/");
            } else {
                setAlertMessage(response.data.error);
                setAlert(true);
            }
        });
    };

    return (
        <div className='flex flex-col items-center justify-center min-h-screen bg-white p-4'>
            {alert && (
                <div className='w-full max-w-sm mb-4'>
                    <Alert severity="error" variant="filled" onClose={() => { setAlert(false); }}>
                        {alertMessage}
                    </Alert>
                </div>
            )}
            <div className='w-full max-w-md border border-black p-5 rounded-xl flex flex-col gap-5 bg-white shadow-lg'>
                <p className='font-bold text-2xl md:text-3xl'>Log in</p>
                <form onSubmit={handleLogin} className='flex flex-col gap-5 pb-10 border-b border-black'>
                    <div className='relative'>
                        <img src={user} alt="User Icon" className='absolute right-3 bottom-3 w-5 md:w-6' />
                        <input
                            name="memberId"
                            type="text"
                            placeholder='Enter member ID'
                            className='rounded-xl w-full px-10 py-3 border border-black'
                        />
                    </div>
                    <div className='relative'>
                        <img src={password} alt="Password Icon" className='absolute right-3 bottom-3 w-5 md:w-6' />
                        <input
                            name="pin"
                            type="password"
                            placeholder='Enter PIN'
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
            </div>
        </div>
    );
}

export default LoginMember;
