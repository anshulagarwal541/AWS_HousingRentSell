import React from 'react';
import front1 from "../../assets/AboutUs/front1.png";
import front2 from "../../assets/AboutUs/front2.png";
import front3 from "../../assets/AboutUs/front3.png";
import front4 from "../../assets/AboutUs/front4.png";

function Front() {
    return (
        <div className='flex flex-col items-center justify-center gap-8 py-5 md:gap-10 md:py-10'>
            {/* Title Section */}
            <div className='w-[90%] md:w-[50%]'>
                <p className='font-bold text-3xl md:text-5xl text-center'>
                    Reimagining real estate to make it easier to unlock.
                </p>
            </div>

            {/* Description Section */}
            <div className='w-[95%] md:w-[70%]'>
                <p className='text-[#626262] text-base md:text-lg text-center'>
                    On the other hand, we denounce with righteous indignation and dislike men who
                    are so beguiled and demoralized by the charms of pleasure of the moment,
                    so blinded by desire, that they cannot foresee the pain and trouble.
                </p>
            </div>

            {/* Image Grid - Fixed layout for all screen sizes */}
            <div className='grid grid-cols-2 px-2 gap-3 w-full max-w-[800px]'>
                <img src={front1} alt="front1" className='w-full h-[200px] md:h-[400px] object-cover rounded-xl' />
                <img src={front2} alt="front2" className='w-full h-[200px] md:h-[400px] object-cover rounded-xl' />
                <img src={front3} alt="front3" className='w-full h-[200px] md:h-[400px] object-cover rounded-xl' />
                <img src={front4} alt="front4" className='w-full h-[200px] md:h-[400px] object-cover rounded-xl' />
            </div>
        </div>
    );
}

export default Front;
