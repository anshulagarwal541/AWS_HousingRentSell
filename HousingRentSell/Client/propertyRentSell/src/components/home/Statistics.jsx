import React from 'react'

function Statistics({ icon, text, stats }) {
    return (
        <div className='bg-transparent flex flex-col gap-5 w-full md:w-1/4 py-5 md:py-10 px-5 md:px-10'>
            <div className='rounded-full bg-white w-fit p-4 md:p-5 flex justify-center items-center'>
                <img src={icon} alt="" className='w-10 md:w-16' />
            </div>
            <p className='font-bold text-3xl md:text-5xl'>
                {stats}
            </p>
            <p className='text-[#406f85] font-bold text-lg md:text-xl'>
                {text}
            </p>
        </div>
    )
}

export default Statistics;
