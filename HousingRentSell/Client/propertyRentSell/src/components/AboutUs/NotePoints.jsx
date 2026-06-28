import React from 'react'

function NotePoints({ index, heading, text }) {
    return (
        <div className='flex flex-col md:flex-row w-[90%] md:w-[80%] justify-between gap-5 md:gap-8 mx-auto'>
            <div className='w-[50px] h-[50px] md:w-[70px] md:h-[70px] text-lg md:text-xl font-extrabold rounded-full border border-black flex items-center justify-center p-2 md:p-5'>
                {index}
            </div>
            <div className='flex flex-col gap-2 md:gap-5'>
                <p className='font-bold text-xl md:text-2xl'>
                    {heading}
                </p>
                <p className='text-[#626262] text-sm md:text-base'>
                    {text}
                </p>
            </div>
        </div>
    )
}

export default NotePoints
