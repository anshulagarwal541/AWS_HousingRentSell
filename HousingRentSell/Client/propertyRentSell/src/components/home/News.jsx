import React, { useState, useEffect, useContext } from 'react';
import NewsCard from './NewsCard';
import ContactUs from './ContactUs';
import { Snackbar, Alert } from '@mui/material';
import axios from 'axios';
import { AuthContext } from '../../Helpers/AuthContext';
import address1 from "../../assets/news1.png";
import address2 from "../../assets/news2.png";
import address3 from "../../assets/news3.png";

function News() {
    const { users, url } = useContext(AuthContext);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (users) {
            const formData = new FormData(e.target);
            const data = {
                from: users._id,
                query: formData.get('query')
            };
            e.target.reset();
            axios.post(`${url}/queries`, data, {
                headers: {
                    accessToken: localStorage.getItem('accessToken')
                }
            }).then((response) => {
                if (!response.data.error) {
                    setSuccess(true);
                } else {
                    console.log(response.data.error);
                }
            });
        } else {
            setError(true);
            e.target.reset();
        }
    };

    const handleClose = () => {
        setSuccess(false);
        setError(false);
    };

    return (
        <div>
            <Snackbar open={success} autoHideDuration={3000} onClose={handleClose}>
                <Alert
                    onClose={handleClose}
                    severity="success"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    Your query is submitted successfully!
                </Alert>
            </Snackbar>
            <div className='bg-[#191919] text-white flex flex-col justify-center items-center'>
                <div className='p-10 flex flex-col gap-10 w-full'>
                    <div>
                        <p className='font-bold text-4xl text-center'>News & Consult</p>
                    </div>
                    <div className='flex flex-wrap justify-center gap-5'>
                        <NewsCard image={address1} text="9 Easy-to-Ambitious DIY Projects to Improve Your Home" />
                        <NewsCard image={address2} text="Serie Shophouse Launch In July, Opportunity For Investors" />
                        <NewsCard image={address3} text="Looking for a New Place? Use This Time to Create Your Wishlist" />
                    </div>
                    <div className='bg-[#c0c0c0] text-black rounded-2xl px-10 py-10 flex flex-col text-center gap-5'>
                        <p className='font-bold text-2xl'>
                            For Recent Update, News.
                        </p>
                        <p className='text-lg text-[#191919]'>
                            We help businesses customize, automate, and scale up their ad production and delivery.
                        </p>
                        <Snackbar open={error} autoHideDuration={3000} onClose={handleClose}>
                            <Alert
                                onClose={handleClose}
                                severity="error"
                                variant="filled"
                                sx={{ width: '100%' }}
                            >
                                Only users are allowed to submit queries or doubts!
                            </Alert>
                        </Snackbar>
                        <form method="POST" onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-5 items-center justify-center'>
                            <input 
                                name="query" 
                                type="text" 
                                className='w-full sm:w-[40%] px-5 py-3 rounded-xl text-black' 
                                placeholder='Enter your queries' 
                            />
                            <button 
                                type="submit" 
                                className='w-full sm:w-auto px-8 py-2 rounded-xl bg-black text-white font-bold'
                            >
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <div className='py-10'>
                <ContactUs />
            </div>
        </div>
    );
}

export default News;
