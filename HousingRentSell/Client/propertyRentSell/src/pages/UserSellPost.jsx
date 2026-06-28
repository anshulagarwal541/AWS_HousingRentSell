import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios';
import { AuthContext } from '../Helpers/AuthContext';
import SellCard from '../components/UserSellRequest/SellCard';

function UserSellPost() {
    const [button, setButton] = useState("pending");
    const [houses, setHouses] = useState(null);
    const [user, setUser] = useState(null);
    const [agent, setAgent] = useState(null);
    const { setAlert, setAlertMessage, setAlertType, url } = useContext(AuthContext);

    useEffect(() => {
        const data = {
            status: "pending"
        };
        axios.post(`${url}/getUserHouses`, data, {
            headers: {
                accessToken: localStorage.getItem('accessToken')
            }
        }).then((response) => {
            if (!response.data.error) {
                console.log("On refresh house = ", response.data)
                setHouses(response.data);
            }
        });

        axios.get(`${url}/getUser`, {
            headers: {
                accessToken: localStorage.getItem('accessToken')
            }
        }).then((response) => {
            if (!response.data.error) {
                setUser(response.data);
            }
        });

        axios.get(`${url}/getMember`, {
            headers: {
                accessMemberToken: localStorage.getItem('accessMemberToken')
            }
        }).then((response) => {
            if (!response.data.error) {
                setAgent(response.data);
            }
        });
    }, [url]);

    const handleClick = (option) => {
        const data = {
            status: option
        };
        axios.post(`${url}/getUserHouses`, data, {
            headers: {
                accessToken: localStorage.getItem('accessToken')
            }
        }).then((response) => {
            if (!response.data.error) {
                console.log("House = ", response.data)
                setHouses(response.data);
            }
            else {
                setAlert(true);
                setAlertMessage(response.data);
                setAlertType("error");
            }
        }).catch((e) => {
            setAlert(true);
            setAlertMessage(e.message);
            setAlertType("error");
        });
        setButton(option);
    }

    return (
        <AuthContext.Provider value={{ setHouses, setAlert, setAlertMessage, setAlertType, url }}>
            <div className='bg-[#ffe0ce] py-5'>
                <p className='text-2xl font-bold text-center'>Property Sell/Buy Section</p>
                <div className='flex justify-center items-center gap-5 py-5 flex-wrap'>
                    <button onClick={() => handleClick("pending")} className={`${button === "pending" ? "bg-white text-red-500 border-2 border-red-500" : "bg-red-500 text-white"} font-bold text-xl rounded-xl px-4 py-2`}>
                        Unsold
                    </button>
                    <button onClick={() => handleClick("waiting")} className={`${button === "waiting" ? "bg-white text-orange-300 border-2 border-orange-300" : "bg-orange-300 text-white"} font-bold text-xl rounded-xl px-4 py-2`}>
                        Requests
                    </button>
                    <button onClick={() => handleClick("sold")} className={`${button === "sold" ? "bg-white text-green-950 border-2 border-green-950" : "bg-green-950 text-white"} font-bold text-xl rounded-xl px-4 py-2`}>
                        Sold
                    </button>
                    <button onClick={() => handleClick("rejected")} className={`${button === "rejected" ? "bg-white text-red-500 border-2 border-red-500" : "bg-red-500 text-white"} font-bold text-xl rounded-xl px-4 py-2`}>
                        Rejected
                    </button>
                    <button onClick={() => handleClick("bought")} className={`${button === "bought" ? "bg-white text-green-950 border-2 border-green-950" : "bg-green-950 text-white"} font-bold text-xl rounded-xl px-4 py-2`}>
                        Bought
                    </button>
                </div>
                <div className=''>
                    {(houses && houses.length) ? (
                        <div className='flex flex-col gap-5 px-2'>
                            {houses.map((house, i) => (
                                <SellCard key={i} house={house} user={user} agent={agent} />
                            ))}
                        </div>
                    ) : (
                        <div className='w-full md:w-1/2 mx-auto bg-[#fff9f5] text-center font-bold text-3xl h-[10rem] rounded-xl flex items-center justify-center'>
                            No queries found
                        </div>
                    )}
                </div>
            </div>
        </AuthContext.Provider>
    )
}

export default UserSellPost;
