import React from 'react'
import StarRatings from 'react-star-ratings';
import { useNavigate } from 'react-router-dom';

function PeopleCard({ member }) {
    const navigate = useNavigate();

    const handleClick = (id) => {
        navigate(`/chat/${id}`)
    }

    return (
        <div className='w-[95%] md:w-[80%] lg:w-[70%] bg-[#fff9f6] mx-auto font-bold text-base md:text-xl rounded-3xl border-2 border-black py-5 px-3 flex flex-col md:flex-row justify-center gap-5'>
            {/* Image Section */}
            <div className='w-full md:w-1/4 flex justify-center md:justify-start'>
                <img src={member.image} alt={member.name} className='rounded-3xl h-[150px] w-[150px] object-cover' />
            </div>

            {/* Details Section */}
            <div className='w-full md:w-2/4 flex flex-col justify-evenly text-center md:text-left'>
                <p>{member.name}</p>
                <p>{member.memberId}</p>
                <p>{member.position}</p>
                <p>{member.email}</p>
                <p>{member.phone}</p>
                <div className='flex justify-center md:justify-start'>
                    <StarRatings
                        rating={member.totalRating}
                        starDimension="20px"
                        starSpacing="2px"
                        numberOfStars={5}
                    />
                </div>
            </div>

            {/* Button Section */}
            <div className='w-full md:w-1/4 flex justify-center items-center'>
                <button 
                    onClick={() => handleClick(member._id)} 
                    className='bg-[#626262] font-bold text-white px-5 md:px-10 py-3 md:py-4 rounded'>
                    Chat
                </button>
            </div>
        </div>
    )
}

export default PeopleCard;
