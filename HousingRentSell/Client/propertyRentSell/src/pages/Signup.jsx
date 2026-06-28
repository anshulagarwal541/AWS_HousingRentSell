import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import password from "../assets/authentication/password.svg";
import user from "../assets/authentication/user.svg";
import axios from 'axios';
import { AuthContext } from '../Helpers/AuthContext';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

function Signup() {
    const { setAlert, setAlertMessage, setAlertType, url } = useContext(AuthContext);
    const [phone, setPhone] = useState("");
    const [showSubmit, setShowSubmit] = useState(false);
    const [signUpData, setSignUpData] = useState(null);
    const navigate = useNavigate();

    const sendOTP = async (e) => {
        e.preventDefault();
        setShowSubmit(true);
        const fd = new FormData(e.target);
        const data = {
            email: fd.get('email'),
            username: fd.get('username'),
            password: fd.get('password'),
            phone: phone
        };
        setSignUpData(data);
        axios.post(`${url}/signup`, data).then((response) => {
            if (!response.data.error) {
                localStorage.setItem('accessToken', response.data);
                setAlert(true);
                setAlertMessage("Registered successfully ..!!!");
                setAlertType("success");
                navigate("/");
            } else {
                setAlert(true);
                setAlertMessage(response.data.error);
                setAlertType("error");
            }
        });
    };

    return (
        <div className='h-screen w-screen flex justify-center items-center bg-[#ffffff] p-4'>
            <div className='w-full max-w-md border border-black p-5 rounded-xl flex flex-col gap-5 bg-white shadow-lg'>
                <p className='font-bold text-3xl md:text-4xl'>Create Account</p>
                <form onSubmit={sendOTP} className='flex flex-col gap-5 pb-10 border-b border-black'>
                    <div className='flex flex-col gap-4 md:gap-5'>
                        <div className='relative w-full'>
                            <img src={user} alt="User Icon" className='absolute right-3 top-1/2 md:top-1/2 transform -translate-y-1/2' />
                            <input
                                name="email"
                                type="text"
                                placeholder='Email Address'
                                className='rounded-xl w-full px-10 py-3 border border-black'
                            />
                        </div>
                        <div className='relative w-full'>
                            <img src={password} alt="Password Icon" className='absolute right-3 top-1/2 md:top-1/2 transform -translate-y-1/2' />
                            <input
                                name='password'
                                type="password"
                                placeholder='Password'
                                className='rounded-xl w-full px-10 py-3 border border-black'
                            />
                        </div>
                        <div className='relative w-full'>
                            <PhoneInput
                                country={"US"}
                                placeholder="Enter phone number"
                                value={phone}
                                onChange={setPhone}
                                className='rounded-xl w-full px-2 py-3 border border-black'
                            />
                        </div>
                        <div className='relative w-full'>
                            <img src={user} alt="Username Icon" className='absolute right-3 top-1/2 md:top-1/2 transform -translate-y-1/2' />
                            <input
                                name="username"
                                type="text"
                                placeholder='Username'
                                className='rounded-xl w-full px-10 py-3 border border-black'
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className='text-white bg-green-950 rounded-xl py-3 font-semibold text-lg w-full'
                    >
                        Sign Up
                    </button>
                </form>
                <div className='flex flex-col items-center gap-4 md:flex-row md:justify-center'>
                    <p className='text-lg md:text-xl font-bold'>Already a user?</p>
                    <Link to="/login" className='text-lg md:text-xl font-semibold border border-black px-5 py-3 rounded-xl'>
                        Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Signup;
