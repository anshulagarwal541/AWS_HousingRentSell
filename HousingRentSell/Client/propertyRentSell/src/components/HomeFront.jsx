import React, { useState, useContext } from 'react';
import front from "../assets/front.png";
import axios from 'axios';
import { Alert, Snackbar } from '@mui/material';
import { AuthContext } from '../Helpers/AuthContext';

function HomeFront() {
    const { url } = useContext(AuthContext);
    const [found, setFound] = useState(false);
    const [notFound, setNotFound] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {};

        formData.forEach((value, key) => {
            if (value) { // Check if the value is not empty
                data[key] = value;
            }
        });

        axios.post(`${url}/findProperty`, data).then((response) => {
            if (!response.data.error) {
                if (response.data.length > 0) {
                    setFound(true);
                } else {
                    setNotFound(true);
                }
            } else {
                console.log(response.data.error);
            }
        });

        e.target.city.value = "";
        e.target.category.value = "";
        e.target.price.value = "";
    };

    const handleClose = () => {
        setFound(false);
        setNotFound(false);
    };

    return (
        <div className='flex flex-col md:flex-row bg-[#fff7f0] p-5'>
            <div className='md:w-1/2 flex flex-col justify-center items-center gap-3 mx-auto md:mx-5 text-center md:text-left'>
                <div className='font-bold text-3xl md:text-5xl w-full leading-tight'>
                    Find a perfect property
                    <br />
                    Where you'll love to live
                </div>
                <div className='text-lg md:text-xl'>
                    We help businesses customize, automate, and scale up their ad production and delivery.
                </div>
                <div className='w-full'>
                    <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
                        <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={found} autoHideDuration={5000} onClose={handleClose}>
                            <Alert
                                onClose={handleClose}
                                severity="success"
                                variant="filled"
                                sx={{ width: '100%' }}
                            >
                                Yes..!! We have properties according to your wish ..!!
                            </Alert>
                        </Snackbar>
                        <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={notFound} autoHideDuration={5000} onClose={handleClose}>
                            <Alert
                                onClose={handleClose}
                                severity="error"
                                variant="filled"
                                sx={{ width: '100%' }}
                            >
                                Sorry !! We don't have properties matching your search type ..
                            </Alert>
                        </Snackbar>
                        <input type="text" name="city" placeholder='City/Street' className='px-4 py-3 rounded-3xl w-full md:w-3/4' />
                        <input type="text" name="category" placeholder='Property Type' className='px-4 py-3 rounded-3xl w-full md:w-3/4' />
                        <input type="number" name="price" placeholder='Price Range' className='px-4 py-3 rounded-3xl w-full md:w-3/4' />
                        <button type="submit" className='bg-black py-3 px-5 rounded-3xl text-white w-full md:w-3/4'>Submit</button>
                    </form>
                </div>
            </div>
            <div className='md:w-1/2 flex justify-center items-center'>
                <img src={front} alt="front" className='w-full h-auto' />
            </div>
        </div>
    );
}

export default HomeFront;
