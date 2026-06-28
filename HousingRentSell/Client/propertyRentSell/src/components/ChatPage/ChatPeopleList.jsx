import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../Helpers/AuthContext';
import axios from 'axios';
import ChatCard from './ChatCard';
import { Link } from 'react-router-dom';

function ChatPeopleList() {
    const { employee, setEmployee, setClickedId, clickedId, messageSent, currentId, setCurrentId, url } = useContext(AuthContext);
    const [chats, setChats] = useState(null);

    useEffect(() => {
        axios.get(`${url}/getMember`, {
            headers: {
                accessMemberToken: localStorage.getItem('accessMemberToken')
            }
        }).then((response) => {
            if (response.data.error) {
                console.log(response.data.error);
            } else {
                console.log("response", response.data);
                setChats(response.data.chats);
            }
        });
    }, [messageSent]);

    const handleClick = (chat) => {
        setClickedId(!clickedId);
        chat.from.name === employee.name ? setCurrentId(chat.to._id) : setCurrentId(chat.from._id);
    };

    return (
        <div className='w-full h-full flex flex-col gap-2 p-5'>
            {/* Search Bar */}
            <input
                className='w-[90%] mx-auto my-5 py-2 rounded-2xl px-3 border border-[#626262] text-sm md:text-base'
                type="text"
                placeholder='Search names...'
            />

            {/* Inbox Title */}
            <div className='w-[90%] mx-auto'>
                <p className='font-bold text-xl md:text-3xl'>Inbox</p>
            </div>

            {/* Navigation Tabs */}
            <div className='w-[90%] mx-auto'>
                <ul className='list-none text-black font-bold flex gap-5 md:gap-10'>
                    <li className='border-b-2 border-b-transparent py-2 hover:border-b-black text-sm md:text-base'>
                        Direct Messages
                    </li>
                    <li className='border-b-2 border-b-transparent py-2 hover:border-b-black text-sm md:text-base'>
                        Archived
                    </li>
                </ul>
            </div>

            {/* Chats Section */}
            <div className='h-full flex flex-col items-center overflow-y-scroll'>
                {chats && chats.length && employee ? (
                    <div className='w-full'>
                        {chats.map((chat, i) => (
                            <Link
                                key={i}
                                onClick={() => handleClick(chat)}
                                to={`/chat/${chat.from.name === employee.name ? chat.to._id : chat.from._id}`}
                                className='block w-full'
                            >
                                <ChatCard
                                    image={chat.from.name === employee.name ? chat.to.image : chat.from.image}
                                    name={chat.from.name === employee.name ? chat.to : chat.from}
                                    chat={chat}
                                    currentId={currentId}
                                />
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className='text-black text-2xl md:text-5xl text-center'>
                        <p>No Chats Yet</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ChatPeopleList;
