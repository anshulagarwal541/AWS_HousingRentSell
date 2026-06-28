import React from 'react'
import { Avatar } from '@mui/material'
function ChatCard({ name, image, chat, currentId }) {
    return (
        <div className='w-[100%] border-b-2 border-b-black py-2 px-5 flex gap-5'>
            <Avatar alt="Remy Sharp" src={image} />
            <div className='flex flex-col gap-2'>
                <p className='font-bold text-2xl'>{name.name}</p>
                <p className='text-xl'>{chat.message}</p>
            </div>
        </div>
    )
}

export default ChatCard