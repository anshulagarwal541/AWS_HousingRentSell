import React from 'react';
import logo from "../../assets/logo.png";

function ContactUs() {
    return (
        <div className='flex flex-col md:flex-row items-center gap-5 md:gap-3 justify-center md:justify-evenly p-5'>
            <div className='mb-5 md:mb-0'>
                <img src={logo} alt="Logo" className='w-[150px] h-[150px] md:w-[200px] md:h-[200px] rounded-full' />
            </div>
            <div className='flex flex-col gap-5 text-center md:text-left'>
                <div className='font-bold'>
                    <p className='text-lg md:text-xl'>
                        Nitte Meenakshi Institute Of Technology,
                    </p>
                    <p className='text-lg md:text-xl'>Bangalore</p>
                    <p className='text-lg md:text-xl'>560064</p>
                </div>
                <p className='text-base md:text-lg'>Contact me at : +917348233507</p>
                <p className='text-base md:text-lg'>Email us at : 1nt21cs138.rachit@nmit.ac.in</p>
            </div>
        </div>
    );
}

export default ContactUs;
