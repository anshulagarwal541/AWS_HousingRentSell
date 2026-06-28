import axios from 'axios'
import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../Helpers/AuthContext'

function ApplicationCard({ application, number }) {
    const { setApplications, url } = useContext(AuthContext);

    const handleContacted = () => {
        const data = {
            _id: application._id
        };
        axios.post(`${url}/updateApplication`, data, {
            headers: {
                accessMemberToken: localStorage.getItem('accessMemberToken')
            }
        }).then((response) => {
            if (!response.data.error) {
                setApplications(response.data);
            } else {
                console.log(response.data.error);
            }
        });
    };

    return (
        <div className='flex flex-col md:flex-row h-auto px-5 py-5 rounded-xl mx-auto bg-[#fff9f5] w-full md:w-[40rem] justify-between gap-5 md:gap-0'>
            <div className='w-full md:w-[45%] flex flex-col justify-evenly'>
                <p className='text-center bg-yellow-600 text-white text-xl md:text-2xl font-bold rounded border border-black'>S.No - {number}</p>
                <p className='text-center text-xl md:text-2xl font-bold'>Client</p>
                <p className='font-semibold text-base md:text-lg'>Name - {application.user.username}</p>
                <p className='font-semibold text-base md:text-lg'>Phone - {application.user.phone}</p>
                <p className='font-semibold text-base md:text-lg'>Email - {application.user.email}</p>
                <p className='font-semibold text-base md:text-lg'>Submitted on - {application.user.date}</p>
                <p className='text-base md:text-lg'>Message - {application.message}</p>
                <p className='font-semibold text-base md:text-lg'>Property - <Link to={`/property/${application.property._id}`} className='bg-black text-white px-6 py-2 rounded-xl text-base md:text-lg'>View Details</Link></p>
            </div>
            <div className='w-full md:w-[45%] flex flex-col justify-between gap-4'>
                <p className='font-semibold text-base md:text-lg'>Agent Name - {application.agent.name}</p>
                <p className='font-semibold text-base md:text-lg'>Position - {application.agent.position}</p>
                <p className='font-semibold text-base md:text-lg'>Email - {application.agent.email}</p>
                <p className='font-semibold text-base md:text-lg'>Rating - {application.agent.totalRating}</p>
                <p className='font-semibold text-base md:text-lg'>Property Head - {application.controller.name} (CEO)</p>
                <p className='font-semibold text-base md:text-lg'>Status - <span className={`${application.status === "pending" ? "text-red-600 border-red-600" : "text-green-950 border-green-950"} rounded-xl text-lg md:text-xl w-fit px-5 py-2 border-2 font-bold`}>{application.status}</span></p>
                {application.status === "pending" ? (
                    <button onClick={handleContacted} className='bg-green-950 text-white px-6 py-2 rounded-xl text-base md:text-lg'>Mark as Contacted</button>
                ) : null}
            </div>
        </div>
    );
}

export default ApplicationCard;
