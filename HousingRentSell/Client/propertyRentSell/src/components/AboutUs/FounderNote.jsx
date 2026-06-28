import React from 'react';
import profilePic3 from "../../assets/AboutUs/profilePic3.jpg";
import NotePoints from './NotePoints';

function FounderNote() {
    return (
        <div className='px-5 md:px-10 py-5 w-[95%] md:w-[90%] mx-auto flex flex-col gap-5'>
            <div className='flex flex-col gap-3'>
                <p className='font-bold text-xl md:text-2xl'>
                    A note from our founders.
                </p>
                <p className='text-base md:text-lg'>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. In a free hour,
                </p>
            </div>
            <div className='flex flex-col md:flex-row py-5 md:py-10 gap-5 md:gap-0'>
                <div className='md:w-1/2 flex flex-col justify-evenly items-center gap-5'>
                    <NotePoints index="1" heading="It all started in 1995" text="Lorem Ipsum is simply dummy text of the printing and typesetting industry." />
                    <NotePoints index="2" heading="Donate launches in 2007" text="Lorem Ipsum is simply dummy text of the printing and typesetting industry." />
                    <NotePoints index="3" heading="Relasto holds its initial public offering in 2008" text="Lorem Ipsum is simply dummy text of the printing and typesetting industry." />
                </div>
                <div className='md:w-1/2 flex justify-center items-center'>
                    <img src={profilePic3} alt="Founder" className='w-[100%] h-auto md:h-[589px] rounded-3xl' />
                </div>
            </div>
        </div>
    );
}

export default FounderNote;
