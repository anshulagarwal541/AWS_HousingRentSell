import React from 'react';
import profilePic from "../../assets/profilePic.jpg";

function TeamCard({ member }) {
    return (
        <div className='flex flex-col gap-5 items-start w-[90%] sm:w-[48%] md:w-[30%] lg:w-[20%] rounded-3xl'>
            {/* Responsive Image */}
            <img src={profilePic} alt="" className='rounded-3xl h-[200px] sm:h-[250px] md:h-[280px] lg:h-[282px] w-full object-cover' />
            <div className='flex flex-col'>
                {/* Name */}
                <p className='font-bold text-xl sm:text-2xl'>
                    {member.name}
                </p>
                {/* Position */}
                <p className='text-[#626262] text-base sm:text-lg'>
                    {member.position}
                </p>
            </div>
        </div>
    );
}

export default TeamCard;