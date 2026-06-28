import React from 'react';
import StarRatings from 'react-star-ratings';

function ReviewCard({ detail }) {
    return (
        <div className='w-full md:w-[90%] lg:w-[80%] h-fit border border-1 border-black rounded-xl mx-auto px-4 md:px-8 lg:px-10 py-4 md:py-5'>
            <p className='text-[#6e6e6e] font-semibold text-xl md:text-2xl lg:text-3xl py-3 md:py-4'>{detail.review}</p>
            <div className='flex flex-col md:flex-row gap-4 md:gap-10 items-center'>
                <StarRatings
                    rating={detail.rating}
                    starDimension="20px"
                    starSpacing="2px"
                    numberOfStars={5}
                />
                <p className='text-lg'>{detail.rating} reviews</p>
            </div>
            <p className='font-bold text-xl md:text-2xl lg:text-3xl py-3 md:py-5'>{detail.user && detail.user.username}</p>
        </div>
    );
}

export default ReviewCard;
