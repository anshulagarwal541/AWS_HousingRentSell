import React, { useState, useEffect, useContext } from 'react'
import { Avatar } from '@mui/material'
import axios from 'axios';
import { AuthContext } from '../../Helpers/AuthContext';
function UpdateDetails({ employee }) {
    const {url, setAlert, setAlertType, setAlertMessage }=useContext(AuthContext)
    const [member, setMember] = useState({
        name: employee.name,
        phone: employee.phone,
        email: employee.email
    });
    const handleFormUpdate = (e) => {
        const { name, value } = e.target;
        setMember(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            _id: employee._id,
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone')
        }
        axios.post(`${url}/updateDetails`, data, {
            headers: {
                accessMemberToken: localStorage.getItem('accessMemberToken')
            }
        }).then((response) => {
            if (response.data.error) {
                setAlert(true);
                setAlertType("error")
                setAlertMessage("Failed to update the details, please ask the admin to give permission..")
            }
            else {
                setAlert(true);
                setAlertType("success")
                setAlertMessage("Successfully updated the details..!!")
            }
        })
    }

    return (
        <div className='w-[40rem] h-fit bg-[#fff7f0] rounded-xl mx-auto border-2 border-black py-5'>
            <p className='font-bold text-3xl flex justify-center items-center'>Update Details</p>
            <form onChange={handleFormUpdate} onSubmit={handleSubmit} action="POST" className='flex flex-col gap-5 py-5'>
                <div className='w-[80%] mx-auto flex justify-center items-center flex-col'>
                    <Avatar sx={{ width: '8rem', height: '8rem' }} src={employee.image} />
                    {/* <input type="file" placeholder='select new profile pic' className='w-[100%] flex justify-start items-start' /> */}
                </div>
                <div className='flex flex-col gap-2'>
                    <label className='w-[80%] mx-auto font-bold text-2xl' htmlFor="name">Your Name :</label>
                    <input className='w-[80%] rounded-xl py-2 px-3 mx-auto' placeholder="enter your name" type="text" name="name" value={member.name} id="name" />
                </div>
                <div className='flex flex-col gap-2'>
                    <label className='w-[80%] mx-auto font-bold text-2xl' htmlFor="phone">Your Phone Number :</label>
                    <input className='w-[80%] rounded-xl py-2 px-3 mx-auto' type="number" minLength="10" maxLength="10" size="10" name="phone" value={member.phone} placeholder="enter your phone" />
                </div>
                <div className='flex flex-col gap-2'>
                    <label className='w-[80%] mx-auto font-bold text-2xl' htmlFor="email">Your email :</label>
                    <input className='w-[80%] rounded-xl py-2 px-3 mx-auto' type="email" name="email" value={member.email} placeholder="enter your email" />
                </div>
                <button type="Submit" className='bg-black text-white font-bold px-5 py-2 rounded w-[80%] mx-auto'>Update Details</button>
            </form>
        </div>
    )
}

export default UpdateDetails