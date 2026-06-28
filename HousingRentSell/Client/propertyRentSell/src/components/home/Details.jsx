import React from 'react';
import "../../stylesheets/Home/home.css";
import house1 from "../../assets/house1.png";
import house2 from "../../assets/house2.png";
import house3 from "../../assets/house3.png";
import house4 from "../../assets/house4.png";
import bestRated from "../../assets/bestRatedHouse.png";

function Details() {
    return (
        <div className='bg-[#fff9f5]'>
            {/* First Section */}
            <div className='flex flex-col md:flex-row p-5 md:p-10'>
                <div className='w-full md:w-1/2 px-5 md:px-10 flex flex-col items-center md:items-start gap-5 md:gap-10 justify-center'>
                    <p className='font-bold text-2xl md:text-3xl text-center md:text-left'>
                        Simple & easy way to find your dream Appointment
                    </p>
                    <p className='text-[#626262] text-center md:text-left'>
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed.
                    </p>
                    <button className='bg-black text-white px-5 py-3 md:px-10 md:py-5 rounded-2xl'>
                        Get Started
                    </button>
                </div>
                <div className='w-full md:w-1/2 flex flex-col md:flex-row gap-5 mt-5 md:mt-0'>
                    <div className='flex flex-row md:flex-col gap-5'>
                        <img src={house1} alt="House 1" className='h-[150px] md:h-[327px] w-full object-cover' />
                        <img src={house3} alt="House 3" className='h-[150px] md:h-[218px] w-full object-cover' />
                    </div>
                    <div className='flex flex-row md:flex-col gap-5'>
                        <img src={house2} alt="House 2" className='h-[150px] md:h-[218px] w-full object-cover' />
                        <img src={house4} alt="House 4" className='h-[150px] md:h-[327px] w-full object-cover' />
                    </div>
                </div>
            </div>

            {/* Second Section */}
            <div className='flex flex-col md:flex-row p-5 md:p-10'>
                <div className='w-full md:w-1/2 flex justify-center'>
                    <div className='w-[80%] h-auto'>
                        <img src={bestRated} alt="Best Rated House" className='w-full object-cover' />
                    </div>
                </div>
                <div className='w-full md:w-1/2 flex flex-col items-center md:items-start gap-5 md:gap-10 mt-5 md:mt-0'>
                    <p className='font-bold text-2xl md:text-3xl text-center md:text-left'>
                        Best rated host on popular rental sites
                    </p>

                    <p className='text-[#626262] text-lg text-center md:text-left'>
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. In a free hour, when our power of choice is untrammelled.
                    </p>

                    <div className='flex flex-col gap-3'>
                        <div className='flex items-center gap-3 font-bold text-lg'>
                            <p>Find excellent deals</p>
                        </div>
                        <div className='flex items-center gap-3 font-bold text-lg'>
                            <p>Find excellent deals</p>
                        </div>
                        <div className='flex items-center gap-3 font-bold text-lg'>
                            <p>Find excellent deals</p>
                        </div>
                    </div>

                    <button className='bg-black text-white px-5 py-3 md:px-5 md:py-4 rounded-2xl font-bold'>
                        Learn more
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Details;
