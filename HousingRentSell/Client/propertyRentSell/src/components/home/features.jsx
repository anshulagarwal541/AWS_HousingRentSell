import React from 'react';
import face from "../../assets/face.svg";
import bag from "../../assets/bag.svg";
import eye from "../../assets/eye.svg";
import search from "../../assets/search.svg";
import Boxes from './boxes';

function Features() {
    return (
        <div className='w-[90%] mx-auto mt-10 mb-10 flex flex-col lg:flex-row gap-5 justify-between'>
            {/* Left section */}
            <div className='w-full lg:w-1/2 bg-[#ffe0ce] rounded-2xl py-10 px-5 flex flex-col items-start justify-evenly'>
                <p className='font-bold text-2xl md:text-3xl lg:text-4xl'>
                    Simple & easy way to find your dream Appointment
                </p>
                <p className='text-lg md:text-xl'>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                </p>
                <button className='bg-black text-white py-3 px-10 font-bold rounded-lg mt-5'>
                    Get Started
                </button>
            </div>

            {/* Right section */}
            <div className='w-full lg:w-1/2 flex flex-col gap-5 lg:gap-10'>
                <div className='flex flex-col md:flex-row gap-5'>
                    <Boxes image={search} text="Search your location" />
                    <Boxes image={eye} text="Visit Appointment" />
                </div>
                <div className='flex flex-col md:flex-row gap-5'>
                    <Boxes image={bag} text="Get your dream house" />
                    <Boxes image={face} text="Enjoy your Appointment" />
                </div>
            </div>
        </div>
    );
}

export default Features;
