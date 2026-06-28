import React from 'react';

function AgentExperience() {
    return (
        <div className='w-[90%] mx-auto py-5 bg-white border border-1 border-black rounded-2xl'>
            <div className='flex flex-col md:flex-row flex-wrap gap-5 md:gap-10 justify-center items-center'>
                <div className='flex flex-col gap-2 justify-center items-center w-full md:w-1/4'>
                    <p className='font-bold text-2xl md:text-3xl'>Experience</p>
                    <p className='text-center'>15+ years experience</p>
                </div>
                <div className='flex flex-col gap-2 justify-center items-center w-full md:w-1/4'>
                    <p className='font-bold text-2xl md:text-3xl'>Property Types</p>
                    <p className='text-center'>
                        Private House, Villa, Townhouse, Apartment
                    </p>
                </div>
                <div className='flex flex-col gap-2 justify-center items-center w-full md:w-1/4'>
                    <p className='font-bold text-2xl md:text-3xl'>Area</p>
                    <p className='text-center'>California, San Jose, Miami</p>
                </div>
                <div className='flex flex-col gap-2 justify-center items-center w-full md:w-1/4'>
                    <p className='font-bold text-2xl md:text-3xl'>Address</p>
                    <p className='text-center'>59 Orchard, NY 5005, US</p>
                </div>
                <div className='flex flex-col gap-2 justify-center items-center w-full md:w-1/4'>
                    <p className='font-bold text-2xl md:text-3xl'>License No</p>
                    <p className='text-center'>BF-0535</p>
                </div>
            </div>
        </div>
    );
}

export default AgentExperience;
