import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../Helpers/AuthContext';
import QueryCard from '../components/Queries/QueryCard';
import { useParams } from 'react-router-dom';
import axios from 'axios';
function UserQuery() {
    const { user, url, alert, setAlert, alertMessage, setAlertMessage, alertType, setAlertType } = useContext(AuthContext);
    const [button, setButton] = useState("pending");
    const { id } = useParams();
    const [queries, setQueries] = useState(null);

    useEffect(() => {
        axios.get(`${url}/getUser`, {
            headers: {
                accessToken: localStorage.getItem('accessToken')
            }
        }).then((response) => {
            if (!response.data.error) {
                const result = response.data.queries.filter(user => user.status === 'pending');
                setQueries(result);
            }
            else {
                setAlert(true)
                setAlertMessage(response.data.error)
                setAlertType("error");
            }
        })

    }, [])

    const handleClick = (option) => {
        const data = {
            status: option
        }
        axios.get(`${url}/getUser`, {
            headers: {
                accessToken: localStorage.getItem('accessToken')
            }
        }).then((response) => {
            if (!response.data.error) {
                const result = response.data.queries.filter(user => user.status === option);
                setQueries(result);
            }
            else {
                console.log(response.data.error);
            }
        })
        setButton(option)
    }

    return (
        <AuthContext.Provider value={{ setQueries }}>
            {console.log("queries", user)}
            <div className='bg-[#ffe0ce] py-5'>
                <p className='text-2xl font-bold flex justify-center items-center'>Queries Section</p>
                <div className='flex justify-center items-center gap-5 py-5'>
                    <button onClick={() => { handleClick("pending") }} className={`${button == "pending" ? "bg-white text-red-500 border-2 border-red-500" : "bg-red-500 text-white"} font-bold text-2xl rounded-xl px-5 py-2`}>Pending</button>
                    <button onClick={() => { handleClick("resolved") }} className={`${button == "resolved" ? "bg-white text-green-950 border-2 border-green-950" : "bg-green-950 text-white"} font-bold text-2xl rounded-xl px-5 py-2`}>Resolved</button>
                </div>
                <div className=''>
                    {(queries && queries.length) ?
                        (
                            <div className='flex flex-col gap-5'>
                                {queries.map((query, i) => {
                                    return <QueryCard key={i} query={query} user={user} />
                                })}
                            </div>
                        )
                        :
                        (
                            <div className='w-1/2 mx-auto bg-[#fff9f5] text-center font-bold text-3xl h-[10rem] rounded-xl flex items-center justify-center'>
                                No queries found
                            </div>
                        )
                    }
                </div>
            </div>
        </AuthContext.Provider>
    )
}

export default UserQuery