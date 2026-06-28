import React from 'react'

function NewsCard({ image, text }) {
    return (
        <div className='w-full md:w-[384px] flex flex-col gap-5'>
            <div>
                <img src={image} alt="" className='w-full h-auto md:h-[350px] object-cover rounded-lg' />
            </div>
            <div>
                <p className='font-bold text-lg md:text-xl'>
                    {text}
                </p>
            </div>
            <div>
                <button className='text-orange-500 font-bold text-sm md:text-xl'>Explore More</button>
            </div>
        </div>
    )
}

export default NewsCard;
