import React from 'react';
import profilePic from "../../assets/profilePic.jpg";

function Author() {
    return (
        <div className='flex flex-col md:flex-row bg-[#ffffff] py-10 items-center justify-center'>
            <div className='w-full md:w-1/4 flex items-center justify-center mb-6 md:mb-0'>
                <img src={profilePic} alt="Profile" className='rounded-3xl h-[200px] md:h-[344px] w-[200px] md:w-auto' />
            </div>
            <div className='w-full md:w-1/2 flex flex-col gap-6 md:gap-10'>
                <div className='flex flex-col md:flex-row justify-between px-6 md:px-10'>
                    <div className='text-center md:text-left'>
                        <p className='font-bold text-xl md:text-2xl'>Rachit Agarwal</p>
                        <p className='text-base md:text-xl'>Mern-Web Developer</p>
                    </div>
                </div>
                <div className='px-6 md:px-10 text-center md:text-left'>
                    <p className='text-base md:text-2xl'>
                        Eget eu massa et consectetur. Mauris donec. Leo a, id sed duis proin sodales. Turpis viverra diam porttitor mattis morbi ac amet. Euismod commodo. We get you customer relationships that last.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Author;
