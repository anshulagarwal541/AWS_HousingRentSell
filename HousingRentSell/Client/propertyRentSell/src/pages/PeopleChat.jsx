import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react'
import PeopleCard from '../components/PeopleChat.jsx/PeopleCard';
import { AuthContext } from '../Helpers/AuthContext';

function PeopleChat() {
    const [allTeam, setAllTeam] = useState(null);
    const [searchTeam, setSearchTeam] = useState(null);
    const {url}=useContext(AuthContext)
    useEffect(() => {
        axios.get(`${url}/allPeopleChats`, {
            headers: {
                accessMemberToken: localStorage.getItem('accessMemberToken')
            }
        }).then((response) => {
            if (!response.data.error) {
                console.log(response.data);
                setAllTeam(response.data);
                setSearchTeam(response.data);
            }
            else {
                console.log(response.data.error);
            }
        })
    }, [])

    const handleSearch = (e) => {
        if (e.target.value.length == 0) {
            setSearchTeam(allTeam);
        }
        else {
            setSearchTeam(allTeam.filter((team) => team.name.toLowerCase().includes(e.target.value.toLowerCase())));
        }
    }

    return (
        <div className='py-5'>
            <p className='font-bold text-2xl w-[90%] mx-auto py-5 text-center'>Memebers</p>
            <div className='w-[90%] mx-auto py-5 flex justify-center items-center'>
                <input onChange={handleSearch} name="name" type="text" placeholder='search name..' className='py-3 px-5 rounded-xl w-[90%] border border-black mx-auto' />
            </div>
            <div className='flex flex-col gap-4'>
                {searchTeam && searchTeam.map((member, i) => {
                    return <PeopleCard key={i} member={member} />
                })}
                {searchTeam && searchTeam.length == 0 && (
                    <div className='font-bold text-2xl text-center'>
                        No members found
                    </div>
                )}
            </div>
        </div>
    )
}

export default PeopleChat