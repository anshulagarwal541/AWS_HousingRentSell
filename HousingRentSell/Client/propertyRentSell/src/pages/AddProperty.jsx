import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import ImagesCarousel from '../components/AddProperty/ImagesCarousel';
import { isMobile, isTablet } from 'react-device-detect';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Helpers/AuthContext';
import { Alert } from '@mui/material';

function AddProperty() {
    const { url, alert, setAlert, alertMessage, setAlertMessage, alertType, setAlertType } = useContext(AuthContext);
    const navigate = useNavigate();
    const deviceType = isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop';
    const [agents, setAgents] = useState(null);
    const [selectedAgent, setSelectedAgent] = useState(null);
    const [selectedImages, setSelectedImages] = useState(null);

    useEffect(() => {
        axios.get(`${url}/teams`).then((response) => {
            if (!response.data.error) {
                setAgents(response.data.filter((agent) => agent.memberId !== "HRS12092002-1"));
            } else {
                console.log(response.data.error);
                setAlert(true)
                setAlertMessage(response.data.error)
                setAlertType("error");
                
            }
        });
    }, [url]);

    const handleSelect = (e) => {
        const a = agents.find((agent) => agent.memberId === e.target.value);
        setSelectedAgent(a);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const data = {
            category: fd.get('category'),
            address: fd.get('address'),
            urls: selectedImages,
            totalPrice: fd.get('totalPrice'),
            emiPrice: fd.get('emiPrice'),
            monthlyPrice: fd.get('monthlyPrice'),
            agentId: fd.get('agent'),
            rooms: fd.get('rooms'),
            area: fd.get('area'),
            bath: fd.get('bath')
        };
        axios.post(`${url}/addProperties`, data, {
            headers: {
                accessMemberToken: localStorage.getItem('accessMemberToken')
            }
        }).then((response) => {
            if (response.data.error) {
                console.log(response.data.error);
                setAlert(true)
                setAlertMessage(response.data.error)
                setAlertType("error");
            } else {
                navigate("/");
            }
        }).catch(e=>{
            setAlert(true);
            setAlertMessage(e.message);
            setAlertType("error");
        });
    };

    const handleImageChange = (e) => {
        const formData = new FormData();
        for (let i = 0; i < e.target.files.length; i++) {
            formData.append('file', e.target.files[i]);
        }
        axios.post(`${url}/upload`, formData).then((response) => {
            if (!response.data.error) {
                setSelectedImages(response.data.urls);
            } else {
                setAlert(true)
                setAlertMessage(response.data.error)
                setAlertType("error");
            }
        });
    };

    return (
        <form method="POST" onSubmit={handleSubmit} className='bg-[#fff9f6] px-2 py-10 flex flex-col gap-5 items-center'>
            {alert && (
                <div className='w-full max-w-md mb-4'>
                    <Alert severity="error" variant="filled" onClose={() => { setAlert(false); setAlertMessage(null); }}>
                        {alertMessage}
                    </Alert>
                </div>
            )}
            <div className='relative bg-white py-10 w-full max-w-4xl mx-auto flex flex-col gap-5 border border-black rounded-2xl'>
                <div className='flex px-3 flex-col gap-5 items-center'>
                    <label htmlFor="images" className='font-bold text-xl'>Select images from the device:</label>
                    <input
                        required
                        onChange={handleImageChange}
                        name="image"
                        id="images"
                        type="file"
                        multiple
                        placeholder='Enter images'
                        className='w-full max-w-md rounded-2xl px-5 py-2 border border-black'
                    />
                </div>
            </div>
            <div className='flex flex-col gap-5 w-full max-w-4xl mx-auto'>
                <div className='flex flex-col gap-5 bg-white p-5 rounded-2xl border border-black'>
                    <p className='font-bold text-3xl'>Trovilla Plan in Sereno Canyon - Estate Collection by Toll Brothers</p>
                    <input
                        required
                        name="address"
                        type="text"
                        placeholder='Enter the address of the property'
                        className='w-full px-5 py-2 rounded-2xl border border-black'
                    />
                    <div className='flex flex-col gap-5 mt-10 sm:flex-row sm:gap-10'>
                        <div className='border border-black p-5 rounded-3xl flex-1'>
                            <input
                                required
                                name="totalPrice"
                                type="number"
                                placeholder='Enter one-time price'
                                className='w-full px-5 py-2 rounded-2xl border border-black'
                            />
                            <p className='font-bold text-xl mt-2'>Online / Cash Payment</p>
                        </div>
                        <div className='border border-black p-5 rounded-3xl flex-1'>
                            <input
                                required
                                name="emiPrice"
                                type="text"
                                placeholder='Enter monthly EMI'
                                className='w-full px-5 py-2 rounded-2xl border border-black'
                            />
                            <p className='font-bold text-xl mt-2'>0% EMI for 6 Months</p>
                        </div>
                    </div>
                    <p className='text-lg mt-5'>
                        <span className='font-bold text-2xl'>
                            Well-constructed 1562 Sq Ft Home Is Now Offering To You In Uttara For Sale
                        </span>
                        A slider is a great way to display a slideshow featuring images or videos, usually on your homepage. Adding sliders to your site is no longer difficult. Just use a slider widget and it will automatically insert the slider on your web page.
                    </p>
                </div>

                <div className='flex flex-col gap-5 bg-white p-5 rounded-2xl border border-black'>
                    <label htmlFor="category" className='font-bold text-xl'>Enter category of the property:</label>
                    <select
                        required
                        name="category"
                        id="category"
                        className='w-full px-5 py-2 border border-black rounded-xl'
                    >
                        <option value="" default>Select here</option>
                        <option value="industrial">Industrial</option>
                        <option value="commercial">Commercial</option>
                        <option value="residential">Residential</option>
                    </select>

                    <label htmlFor="bath" className='font-bold text-2xl mt-4'>Bathrooms:</label>
                    <input
                        required
                        id="bath"
                        name="bath"
                        type="text"
                        placeholder='Enter number of bathrooms'
                        className='w-full px-5 py-2 rounded-2xl border border-black'
                    />

                    <label htmlFor="rooms" className='font-bold text-2xl mt-4'>Rooms:</label>
                    <input
                        required
                        id="rooms"
                        name="rooms"
                        type="text"
                        placeholder='Enter number of rooms'
                        className='w-full px-5 py-2 rounded-2xl border border-black'
                    />

                    <label htmlFor="area" className='font-bold text-2xl mt-4'>Area:</label>
                    <input
                        required
                        id="area"
                        name="area"
                        type="text"
                        placeholder='Enter the area'
                        className='w-full px-5 py-2 rounded-2xl border border-black'
                    />
                </div>

                <div className='flex flex-col gap-5 bg-white p-5 rounded-2xl border border-black'>
                    <label htmlFor="agent" className='font-bold text-xl'>Select Agent you wish to assign for this property:</label>
                    <select
                        required
                        name="agent"
                        onChange={handleSelect}
                        id="agent"
                        className='w-full px-5 py-2 border border-black rounded-2xl'
                    >
                        <option value="" default>Please select agent</option>
                        {agents && agents.map((agent) => (
                            <option key={agent.memberId} value={agent.memberId}>
                                {agent.name} - ({agent.memberId})
                            </option>
                        ))}
                    </select>
                    <p className='font-bold text-3xl mt-4'>Agent Information</p>
                    <div className='flex flex-col gap-5'>
                        <p className='font-semibold'>Name: {selectedAgent ? selectedAgent.name : "NIL"}</p>
                        <p className='font-semibold'>Email: {selectedAgent ? selectedAgent.email : "NIL"}</p>
                        <p className='font-semibold'>Phone: {selectedAgent ? selectedAgent.phone : "NIL"}</p>
                        <p className='font-semibold'>Member ID: {selectedAgent ? selectedAgent.memberId : "NIL"}</p>
                        <p className='font-semibold'>Position: {selectedAgent ? selectedAgent.position : "NIL"}</p>
                        <p className='font-semibold'>Total Rating: {selectedAgent ? selectedAgent.totalRating : "NIL"}</p>
                    </div>
                </div>
            </div>

            {selectedImages ? (
                <div className='flex flex-col gap-5 w-full max-w-4xl mx-auto'>
                    <ImagesCarousel selectedImages={selectedImages} />
                    <button type="submit" className='py-2 px-5 mx-auto bg-black text-white font-bold rounded text-center'>Add Property</button>
                </div>
            ) : (
                <div className='py-2 px-5 mx-auto font-bold rounded-2xl text-center border border-black'>
                    <p className='font-bold text-xl'>Please wait while your image is uploading...</p>
                    <CircularProgress />
                </div>
            )}
        </form>
    );
}

export default AddProperty;
