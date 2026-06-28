import React from 'react';
import StarRatings from 'react-star-ratings';
import { useNavigate } from 'react-router-dom';

function AgentListCard({ agent }) {
    const navigate = useNavigate();

    const handleView = () => {
        navigate(`/agent/${agent._id}`);
    };

    return (
        <div className='bg-white w-full max-w-sm md:w-fit rounded-xl border border-black'>
            <img 
                src={agent.image} 
                alt="profile" 
                className='w-full h-48 md:h-56 lg:h-64 object-cover rounded-t-xl' 
            />
            <div className='p-4 flex flex-col gap-3'>
                <div className='flex flex-col gap-2'>
                    <p className='font-bold text-lg md:text-xl'>{agent.name}</p>
                    <p className='text-sm md:text-base'>{agent.email}</p>
                    <div className='flex items-center gap-2'>
                        <StarRatings
                            rating={agent.totalRating}
                            starDimension="20px"
                            starSpacing="2px"
                            numberOfStars={5}
                        />
                        <span className='text-sm md:text-base'>{agent.totalRating} reviews</span>
                    </div>
                </div>
                <button 
                    onClick={handleView} 
                    className='bg-black text-white border border-black w-full px-4 py-2 rounded hover:bg-gray-800'
                >
                    View Profile
                </button>
            </div>
        </div>
    );
}

export default AgentListCard;
