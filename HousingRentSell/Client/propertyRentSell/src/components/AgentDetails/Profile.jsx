import React from 'react';
import StarRatings from 'react-star-ratings';

function Profile({ teamMember }) {
    return (
        <div className='flex flex-col md:flex-row gap-5 md:gap-10 items-center w-[90%] mx-auto justify-between py-5'>
            <img 
                src={teamMember.image} 
                alt="" 
                className='h-[150px] w-[150px] object-cover rounded-2xl' 
            />
            <div className='flex flex-col items-start'>
                <p className='font-bold text-xl md:text-2xl'>{teamMember.name}</p>
                <div className='flex items-center gap-2'>
                    <StarRatings
                        rating={teamMember.totalRating}
                        starDimension="15px"
                        starSpacing="2px"
                        numberOfStars={5}
                    />
                    <span className='text-sm md:text-base'>
                        {teamMember.totalRating} reviews
                    </span>
                </div>
            </div>
            <div className='flex flex-col items-start'>
                <p className='font-semibold text-lg md:text-xl'>{teamMember.email}</p>
                <p className='font-semibold text-lg md:text-xl'>{teamMember.phone}</p>
            </div>
            <button className='bg-black text-white px-5 py-2 md:px-6 md:py-3 rounded-2xl text-base md:text-xl'>
                Contact
            </button>
        </div>
    );
}

export default Profile;
