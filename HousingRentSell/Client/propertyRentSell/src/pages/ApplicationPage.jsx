import React, { useState, useEffect, useContext } from 'react';
import ApplicationCard from '../components/Application/ApplicationCard';
import axios from 'axios';
import { AuthContext } from '../Helpers/AuthContext';

function ApplicationPage() {
    const [button, setButton] = useState("pending");
    const [applications, setApplications] = useState();
    const { url, alert, setAlert, alertMessage, setAlertMessage, alertType, setAlertType } = useContext(AuthContext);

    useEffect(() => {
        const data = {
            status: "pending"
        };
        axios.post(`${url}/getApplications`, data, {
            headers: {
                accessMemberToken: localStorage.getItem('accessMemberToken')
            }
        }).then((response) => {
            if (!response.data.error) {
                setApplications(response.data);
            } else {
                setAlert(true)
                setAlertMessage(response.data.error)
                setAlertType("error");
            }
        });
    }, []);

    const handleClick = (option) => {
        const data = {
            status: option
        };
        axios.post(`${url}/getApplications`, data, {
            headers: {
                accessMemberToken: localStorage.getItem('accessMemberToken')
            }
        }).then((response) => {
            if (!response.data.error) {
                setApplications(response.data);
            } else {
                setAlert(true)
                setAlertMessage(response.data.error)
                setAlertType("error");
            }
        });
        setButton(option);
    };

    return (
        <AuthContext.Provider value={{ setApplications, url }}>
            <div className='bg-[#ffe0ce] py-5 min-h-screen'>
                <p className='text-2xl font-bold flex justify-center items-center'>Applications</p>
                <div className='flex flex-wrap justify-center items-center gap-5 py-5'>
                    <button
                        onClick={() => { handleClick("pending") }}
                        className={`${button === "pending" ? "bg-white text-red-500 border-2 border-red-500" : "bg-red-500 text-white"} font-bold text-xl rounded-xl px-5 py-2`}
                    >
                        Pending
                    </button>
                    <button
                        onClick={() => { handleClick("contacted") }}
                        className={`${button === "contacted" ? "bg-white text-green-950 border-2 border-green-950" : "bg-green-950 text-white"} font-bold text-xl rounded-xl px-5 py-2`}
                    >
                        Contacted
                    </button>
                </div>
                <div className='h-full px-5'>
                    {(applications && applications.length) ?
                        (
                            <div className='flex flex-row flex-wrap gap-5 overflow-y-scroll max-h-[80vh]'>
                                {applications.map((application, i) => (
                                    <ApplicationCard key={i} application={application} number={i} />
                                ))}
                            </div>
                        ) :
                        (
                            <div className='mx-auto bg-[#fff9f5] text-center font-bold text-2xl h-[20rem] w-full md:w-[70%] rounded-xl flex items-center justify-center'>
                                No applications found
                            </div>
                        )
                    }
                </div>
            </div>
        </AuthContext.Provider>
    );
}

export default ApplicationPage;
