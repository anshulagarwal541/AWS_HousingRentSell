import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AgentListCard from '../components/AgentList/AgentListCard';
import { AuthContext } from '../Helpers/AuthContext';

function AgentList() {
    const { url, alert, setAlert, alertMessage, setAlertMessage, alertType, setAlertType } = useContext(AuthContext);
    const [agents, setAgents] = useState(null);
    const [sliceAgents, setSliceAgents] = useState(null);
    const [end, setEnd] = useState(4);

    useEffect(() => {
        axios.get(`${url}/teams`).then((response) => {
            if (!response.data.error) {
                setAgents(response.data);
                setSliceAgents(response.data.slice(0, 4));
                setEnd(8);
            } else {
                setAlert(true)
                setAlertMessage(response.data.error)
                setAlertType("error");
            }
        });
    }, [url]);

    const handleLoad = () => {
        setSliceAgents(agents.slice(0, end));
        setEnd(end + 4);
    };

    return (
        <div className='bg-[#fff7f0] py-5'>
            <div className='w-[90%] mx-auto font-semibold text-lg text-center md:text-left'>
                <span className='font-bold text-3xl'>Welcome to the cores!</span>
                <br />
                Here you will find our company members who are always there to help you and guide you
            </div>
            <div className='flex flex-wrap justify-center items-center gap-5 w-[90%] mx-auto py-10'>
                {sliceAgents && sliceAgents.map((agent, i) => (
                    <AgentListCard key={i} agent={agent} />
                ))}
            </div>
            {sliceAgents && agents && sliceAgents.length === agents.length ? "" : (
                <div className='flex items-center justify-center py-5'>
                    <button 
                        onClick={handleLoad} 
                        className='bg-black text-white px-6 py-2 border border-white rounded hover:bg-gray-800 transition'
                    >
                        Load More
                    </button>
                </div>
            )}
        </div>
    );
}

export default AgentList;
