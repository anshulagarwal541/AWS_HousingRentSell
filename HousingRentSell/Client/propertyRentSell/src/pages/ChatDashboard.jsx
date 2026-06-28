import React, { useContext, useEffect } from 'react'
import ChatMessage from '../components/ChatPage/ChatMessage'
import ChatPeopleList from '../components/ChatPage/ChatPeopleList'
import { AuthContext } from '../Helpers/AuthContext';
import axios from 'axios';

function ChatDashboard({ children }) {
    const { url, employee, setEmployee, member, clickedId, setClickedId, messageSent, setMessageSent, currentId, setCurrentId } = useContext(AuthContext);

    useEffect(() => {
        axios.get(`${url}/getMember`, {
            headers: {
                accessMemberToken: localStorage.getItem('accessMemberToken')
            }
        }).then((response) => {
            if (!response.data.error) {
                setEmployee(response.data);
            }
            else {
                console.log(response.data.error);
            }
        });
    }, []);

    return (
        <AuthContext.Provider value={{ employee, setEmployee, member, clickedId, setClickedId, messageSent, setMessageSent, currentId, setCurrentId, url }}>
            <div className='flex flex-col md:flex-row h-[100vh]'>
                {/* Chat People List */}
                <div className='w-full md:w-[40%] h-[50vh] md:h-full bg-[#fff9f6] overflow-y-auto'>
                    <ChatPeopleList />
                </div>
                
                {/* Chat Message Area */}
                <div className='w-full md:w-[60%] h-[50vh] md:h-full flex justify-center items-center'>
                    {employee && (
                        children
                    )}
                    {!children && (
                        <div className='font-bold text-lg md:text-3xl text-center'>
                            No messages to show..
                        </div>
                    )}
                </div>
            </div>
        </AuthContext.Provider>
    )
}

export default ChatDashboard;
