import React, { useEffect, useState } from 'react'
import ChatPeopleList from '../components/ChatPage/ChatPeopleList'
import ChatMessage from '../components/ChatPage/ChatMessage'
import { AuthContext } from '../Helpers/AuthContext'
import { useContext } from 'react'
import axios from 'axios'
function ChatPage() {
    const { member, setMember, url } = useContext(AuthContext);
    const [employee, setEmployee] = useState(null);
    const [clickedId, setClickedId] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [messageSent, setMessageSent] = useState(false);
    useEffect(() => {
        axios.get(`${url}/getMember`, {
            headers: {
                accessMemberToken: localStorage.getItem('accessMemberToken')
            }
        }).then((response) => {
            if (response.data.error) {
                console.log(response.data.error);
            }
            else {
                console.log("response", response.data);
                setEmployee(response.data);
            }
        })
    }, [])
    return (
        <AuthContext.Provider value={{ member, employee, setEmployee, clickedId, setClickedId, messageSent, setMessageSent, currentId, setCurrentId }}>
            <div className='flex h-[100vh]'>
                {/* bg-[#626262] */}
                <div className='w-[40%] #fff9f6'>
                    <ChatPeopleList />
                </div>
                <div className='w-[60%]'>
                    <ChatMessage />
                </div>
            </div>
        </AuthContext.Provider>
    )
}

export default ChatPage