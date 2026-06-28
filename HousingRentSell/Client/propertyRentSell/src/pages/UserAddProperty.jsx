import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import ImagesCarousel from '../components/AddProperty/ImagesCarousel';
import { AuthContext } from '../Helpers/AuthContext';
import { Alert } from '@mui/material';

function UserAddProperty() {
    const navigate = useNavigate();
    const [selectedImages, setSelectedImages] = useState(null);
    const [user, setUser] = useState(null);
    const { url, setAlertType, setAlertMessage, setAlert, alert, alertMessage, alertType } = useContext(AuthContext);

    useEffect(() => {
        axios.get(`${url}/getUser`, {
            headers: {
                accessToken: localStorage.getItem('accessToken')
            }
        }).then((response) => {
            if (!response.data.error) {
                setUser(response.data);
            } else {
                setAlert(true)
                setAlertMessage(response.data.error)
                setAlertType("error");
            }
        });
    }, [url]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const data = {
            category: fd.get('category'),
            address: fd.get('address'),
            urls: selectedImages,
            totalPrice: fd.get('totalPrice'),
            emiPrice: fd.get('emiPrice'),
            rooms: fd.get('rooms'),
            area: fd.get('area'),
            bath: fd.get('bath'),
            userName: fd.get('name'),
            userEmail: fd.get('email'),
            userPhone: fd.get('phone')
        };
        axios.post(`${url}/userSellProperty`, data, {
            headers: {
                accessToken: localStorage.getItem('accessToken')
            }
        }).then((response) => {
            if (response.data.error) {
                console.log(response.data.error);
                setAlert(true);
                setAlertMessage(response.data.error);
                setAlertType("error");
            } else {
                setAlert(true);
                setAlertMessage("Successfully added a property to sell, wait for HRS Team to respond");
                setAlertType("success");
                navigate("/");
            }
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
                console.log(response.data.error);
            }
        });
    };

    return (
        <form method="POST" onSubmit={handleSubmit} className="bg-[#fff9f6] py-10 flex flex-col justify-center gap-5">
            {/* Welcome Section */}
            <div className="relative px-2 bg-white py-10 w-[90%] lg:w-[60%] mx-auto flex flex-col gap-5 border border-black rounded-2xl my-5">
                <p className="text-2xl lg:text-5xl font-bold text-center mx-auto">Welcome to the selling section</p>
                <p className="text-sm lg:text-lg text-center mx-auto">
                    Our company truly values your choices and opinions. We pledge to give the best rates for the selected properties.
                </p>
            </div>

            {/* Image Upload Section */}
            <div className="relative bg-white py-10 w-[90%] lg:w-[60%] mx-auto flex flex-col gap-5 border border-black rounded-2xl my-5">
                <div className="flex flex-col px-2 lg:flex-row gap-5 justify-center items-center">
                    <label htmlFor="images" className="font-bold text-xl">Select images from the device:</label>
                    <input
                        onChange={handleImageChange}
                        name="image"
                        id="images"
                        type="file"
                        multiple
                        className="w-full lg:w-[30%] rounded-2xl px-5 py-2 border border-black"
                    />
                </div>
            </div>

            {/* Property Details Section */}
            <div className="flex flex-col gap-5 w-[90%] lg:w-[60%] mx-auto">
                <div className="flex flex-col gap-5 px-5 py-5 bg-white rounded-2xl border border-black">
                    <p className="font-bold text-xl lg:text-4xl">Trovilla Plan in Sereno Canyon - Estate Collection by Toll Brothers</p>
                    <input
                        name="address"
                        type="text"
                        placeholder="Enter the address of the property"
                        className="w-full px-5 py-2 rounded-2xl border border-black"
                    />

                    <div className="flex flex-col lg:flex-row gap-5 mt-10">
                        <div className="border border-black p-5 rounded-3xl w-full lg:w-1/2">
                            <input
                                name="totalPrice"
                                type="number"
                                placeholder="Enter one-time price"
                                className="w-full px-5 py-2 rounded-2xl border border-black"
                            />
                            <p className="font-bold text-xl text-center py-2">Online / Cash Payment</p>
                        </div>
                        <div className="border border-black p-5 rounded-3xl w-full lg:w-1/2">
                            <input
                                name="emiPrice"
                                type="text"
                                placeholder="Enter monthly EMI"
                                className="w-full px-5 py-2 rounded-2xl border border-black"
                            />
                            <p className="font-bold text-xl text-center py-2">0% EMI for 6 Months</p>
                        </div>
                    </div>
                </div>

                {/* Additional Property Details */}
                <div className="flex flex-col px-5 py-5 bg-white rounded-2xl border border-black">
                    <label className="font-bold text-xl">
                        Category of Property:
                        <select name="category" id="category" className="ml-2 px-5 py-2 rounded-xl border border-black">
                            <option value="none">Select here</option>
                            <option value="industrial">Industrial</option>
                            <option value="commercial">Commercial</option>
                            <option value="residential">Residential</option>
                        </select>
                    </label>

                    <input
                        id="bath"
                        name="bath"
                        type="text"
                        placeholder="Enter number of bathrooms"
                        className="w-full mt-5 px-5 py-2 rounded-2xl border border-black"
                    />

                    <input
                        id="rooms"
                        name="rooms"
                        type="text"
                        placeholder="Enter number of rooms"
                        className="w-full mt-5 px-5 py-2 rounded-2xl border border-black"
                    />

                    <input
                        id="area"
                        name="area"
                        type="text"
                        placeholder="Enter property area (sqft)"
                        className="w-full mt-5 px-5 py-2 rounded-2xl border border-black"
                    />
                </div>

                {/* User Details */}
                {user && (
                    <div className="flex flex-col px-5 py-5 gap-5 bg-white rounded-2xl border border-black">
                        <p className="font-bold text-xl">Please provide your contact details:</p>
                        <input
                            value={user.username}
                            className="w-full px-5 py-2 rounded-xl border border-black"
                            type="text"
                            name="name"
                            placeholder="Your Name"
                        />
                        <input
                            value={user.email}
                            className="w-full px-5 py-2 rounded-xl border border-black"
                            type="email"
                            name="email"
                            placeholder="Your Email"
                            required
                        />
                        <input
                            value={user.phone}
                            className="w-full px-5 py-2 rounded-xl border border-black"
                            type="number"
                            name="phone"
                            placeholder="Your Phone Number"
                        />
                    </div>
                )}
            </div>

            {/* Image Preview and Submit Button */}
            {selectedImages ? (
                <div className="flex flex-col gap-5 w-[90%] lg:w-[60%] mx-auto justify-center items-center">
                    <ImagesCarousel selectedImages={selectedImages} />
                    <button
                        type="submit"
                        className="py-2 px-5 bg-black text-white font-bold rounded text-center"
                    >
                        Add Property
                    </button>
                </div>
            ) : (
                <div className="py-2 px-5 w-[90%] lg:w-[60%] mx-auto font-bold text-center border border-black rounded-2xl">
                    <p className="text-xl">Please wait while your images are uploading...</p>
                    <CircularProgress />
                </div>
            )}
        </form>
    );
}

export default UserAddProperty;
