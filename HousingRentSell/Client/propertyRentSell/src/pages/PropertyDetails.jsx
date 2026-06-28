import React, { useContext, useEffect, useState } from 'react'
import NavBar from '../components/navBar'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios';
import propertyImage1 from "../assets/property/propertyImage1.png";
import propertyImage2 from "../assets/property/propertyImage2.png";
import propertyImage3 from "../assets/property/propertyImage3.png";
import { Link } from 'react-router-dom';
import profilePic from "../assets/profilePic.jpg";
import { Alert, Snackbar } from '@mui/material';
import { AuthContext } from '../Helpers/AuthContext';
import { Navigate } from 'react-router-dom';
import ClusterMap from '../components/PropertyDetails/ClusterMap';
function PropertyDetails() {
    const navigate = useNavigate();
    const { setNotLoggedIn, setAlert, setAlertMessage, setAlertType, url } = useContext(AuthContext);
    const { id } = useParams();
    const [property, setProperty] = useState(null);
    const [user, setUser] = useState(null);
    const [markValue, setMarkValue] = useState("rejected");
    const [agents, setAgents] = useState([]);
    const [applicableUsers, setApplicableUsers] = useState(null);
    useEffect(() => {
        axios.get(`${url}/properties/${id}`).then((response) => {
            if (!response.data.error) {
                setProperty(response.data);
            }
            else{
                setAlert(true)
                setAlertMessage(response.data.error)
                setAlertType("error");
            }
        })
        axios.get(`${url}/getUser`, {
            headers: {
                accessToken: localStorage.getItem('accessToken')
            }
        }).then((response) => {
            if (!response.data.error) {
                setUser(response.data);
            }
            else {
                axios.get(`${url}/getMember`, {
                    headers: {
                        accessMemberToken: localStorage.getItem('accessMemberToken')
                    }
                }).then((response) => {
                    if (!response.data.error) {
                        setUser(response.data);
                    }
                    else {
                        setNotLoggedIn(true);
                        navigate('/login')
                    }
                })
            }
        })
        axios.get(`${url}/teams`).then((res) => {
            if (!res.data.error) {
                const allAgents = res.data.filter((team) => team.memberId !== "HRS12092002-1")
                setAgents(allAgents)
            }
            else {
                setAlert(true)
                setAlertType("error")
                setAlertMessage(response.data.error);
            }
        })

    }, [])

    const handleSubmit = (e) => {
        e.preventDefault();
        if (user && !user.memberId) {
            const formData = new FormData(e.target);
            const data = {
                name: formData.get('name'),
                phone: formData.get('phone'),
                email: formData.get('email'),
                date: formData.get('date'),
                message: formData.get('message'),
                propertyId: property._id,
                agent: property.agent._id,
                controller: property.controller._id
            }
            axios.post(`${url}/submitApplication`, data, {
                headers: {
                    accessToken: localStorage.getItem('accessToken')
                }
            }).then((response) => {
                if (!response.data.error) {
                    setAlertType('success');
                    setAlertMessage("Your application is submitted successfully. Please wait for an agent to call you..");
                    setAlert(true);
                }
                else {
                    setAlertMessage(response.data.error);
                    setAlert(true)
                    setAlertType('error')
                }
            })
            e.target.name.value = "";
            e.target.email.value = "";
            e.target.phone.value = "";
            e.target.message.value = "";
            e.target.date.value = "";
        }
        else {
            setAlertMessage("Only Clients are allowed to submit an application.");
            setAlert(true)
            setAlertType('error')
        }
    }

    const handleMark = (markValue) => {
        try {
            if(property.companySellStatus == "sold")
            {
                setAlert(true)
                setAlertMessage("Property is already sold, You are no longer owner of this one.");
                setAlertType("error");
                return;
            }
            if (markValue == "approved" && property.userSellStatus === "waiting") {
                setAlertMessage("You have already applied for this property. Plese wait for the confirmation from the seller.!!")
                setAlertType("warning")
                setAlert(true);
            }
            else if (markValue === "rejected") {
                axios.post(`${url}/removeUserHouse`, { houseId: property._id }, {
                    headers: {
                        accessMemberToken: localStorage.getItem('accessMemberToken')
                    }
                }).then((response) => {
                    if (!response.data.error) {
                        setAlertMessage(response.data);
                        setAlertType('success');
                        setAlert(true);
                        navigate('/');
                    }
                    else {
                        setAlertMessage(response.data.error);
                        setAlertType('error');
                        setAlert(true);
                    }
                })
            }
            else if (markValue === 'sold') {
                axios.post(`${url}/getAppliedUsers`, { houseId: id }, {
                    headers: {
                        accessMemberToken: localStorage.getItem('accessMemberToken')
                    }
                }).then((response) => {
                    if (!response.data.error) {
                        setApplicableUsers(response.data);
                    }
                    else {
                        setAlert(true)
                        setAlertType("error")
                        setAlertMessage(response.data.error);
                        navigate("/")
                    }
                })
            }
        }
        catch (e) {
            console.log(e.message)
        }
        setMarkValue(markValue)
    }

    const handleApprove = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            houseId: property._id,
            agentId: formData.get('agent')
        };
        axios.post(`${url}/setHouseWaiting`, data, {
            headers: {
                accessMemberToken: localStorage.getItem('accessMemberToken')
            }
        }).then((response) => {
            if (!response.data.error) {
                setAlert(true);
                setAlertMessage(response.data);
                setAlertType("success")
                navigate("/");
            }
            else {
                setAlertMessage(response.data.error);
                setAlertType("error")
                setAlert(true);
            }
        })
    }

    const handleRemoveProperty = () => {
        const d = {
            propertyId: property._id,
            agentId: property.agent._id.toString()
        }
        axios.post(`${url}/deleteProperty`, d, {
            headers: {
                accessMemberToken: localStorage.getItem('accessMemberToken')
            }
        }).then((response) => {
            if (!response.data.error) {
                setAlertMessage(response.data);
                setAlertType("success");
                setAlert(true);
                navigate("/")
            }
            else {
                setAlertMessage(response.data.error);
                setAlertType("error");
                setAlert(true);
            }
        })
    }

    const handleSoldProperty = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            owner: formData.get('owner'),
            propertyId: property._id
        }
        axios.post(`${url}/sellProperty`, data, {
            headers: {
                accessMemberToken: localStorage.getItem('accessMemberToken')
            }
        }).then((response) => {
            if (response.data.error) {
                setAlertMessage(response.data.error);
                setAlertType("error")
                setAlert(true);
            }
            else {
                setAlertMessage(response.data);
                setAlertType("success");
                setAlert(true);
                navigate("/");
            }
        }).catch(e=>{
            console.log(e.message);
        })
    }

    return (
        <div className='bg-[#fff9f6] py-10'>
            <div className='h-auto xl:h-[600px] w-[90%] py-2 mx-auto flex flex-col flex-wrap gap-5'>
                <div className='relative flex h-fit xl:h-[600px] flex-col flex-wrap gap-5'>
                    {property && property.images.slice(0, 3).map((image, i) => {
                        return <img key={i} src={image} alt="" className={`${i === 0 ? "w-full h-[20rem] xl:h-[550px] xl:w-[850px]" : "h-[20rem] xl:h-[263px]"} rounded-3xl`} />
                    })}
                    <div className='absolute w-fit h-fit bottom-20 right-10'>
                        <Link to={`/property/${id}/images`}><button className='bg-white text-black border-2 rounded-3xl w-fit px-5 py-2'>See more</button></Link>
                    </div>
                </div>

            </div>
            <div className='flex flex-col  lg:flex-row gap-5 w-[90%] mx-auto justify-center lg:justify-between'>
                <div className='w-full lg:w-[850px] justify-center flex flex-col gap-10'>
                    {property && (
                        <div className='flex px-5 py-5 lg:px-10 lg:py-5 gap-5 flex-col bg-white rounded-2xl border border-1 border-black'>
                            <p className='font-bold text-2xl md:text-3xl lg:text-4xl'>{property.address}</p>
                            <div className='flex flex-col md:flex-row gap-5 mt-5 md:mt-10'>
                                <div className='border border-1 border-black p-4 md:p-5 rounded-3xl'>
                                    <span className='font-bold text-lg md:text-xl'>${property.totalPrice}</span>
                                    <p className='text-sm md:text-base'>Online / Cash Payment</p>
                                </div>
                                <div className='border border-1 border-black p-4 md:p-5 rounded-3xl'>
                                    <span className='font-bold text-lg md:text-xl'>${property.emiPrice} / month</span>
                                    <p className='text-sm md:text-base'>0% EMI for 6 Months</p>
                                </div>
                            </div>
                            <p className='text-sm md:text-base lg:text-lg flex flex-col gap-2'>
                                <span className='font-bold text-2xl md:text-3xl lg:text-3xl mt-5'>
                                    Well-constructed 1562 Sq Ft Home Is Now Offering To You In Uttara For Sale
                                </span>
                                A slider is a great way to display a slideshow featuring images or videos, usually on your homepage. Adding sliders to your site is no longer difficult. You don’t have to know coding anymore. Just use a slider widget and it will automatically insert the slider on your web page. So, the Elementor slider would be a great tool to work with when building a WordPress site.
                            </p>
                        </div>

                    )}
                    {property && (
                        <div className='flex px-5 py-5 lg:px-10 lg:py-5 gap-5 flex-col bg-white rounded-2xl border border-1 border-black'>
                            <p className='font-black text-2xl md:text-3xl'>Detailed Overview :-</p>
                            <p className='text-lg md:text-xl'><span className='font-bold'>Property Type :-</span> {property.category}</p>
                            <p className='text-lg md:text-xl'><span className='font-bold'>Rooms :-</span> {property.rooms}</p>
                            <p className='text-lg md:text-xl'><span className='font-bold'>Bathrooms :-</span> {property.bath}</p>
                            <p className='text-lg md:text-xl'><span className='font-bold'>Area :-</span> {property.area} sqft</p>
                        </div>
                    )}
                    {property && (
                        <div>
                            <ClusterMap property={property} />
                        </div>
                    )}
                    {property && property.sellerType === "company" && property.agent && (
                        <div className='flex px-5 py-5 lg:px-10 lg:py-5 gap-5 flex-col bg-white rounded-2xl border border-1 border-black'>
                            <p className='font-black text-2xl md:text-3xl text-center md:text-start'>Agent Information</p>
                            <div className='flex flex-col justify-center items-center md:justify-start md:items-start md:flex-row gap-5'>
                                <img src={profilePic} alt="Agent Profile" className='h-[100px] w-[100px] md:h-[150px] md:w-[150px] rounded-3xl' />
                                <div className='text-base md:text-lg flex flex-col justify-evenly'>
                                    <p className='font-semibold'>{property && property.agent.name}</p>
                                    <p>{property && property.agent.email}</p>
                                    <p>{property && property.agent.phone}</p>
                                </div>
                            </div>
                        </div>

                    )}
                    {property && property.sellerType === "user" && property.seller && (
                        <div className='flex px-10 py-5 gap-5 flex-col bg-white rounded-2xl border border-1 border-black'>
                            <p className='font-black text-3xl'>Seller Information</p>
                            <div className='flex gap-5'>
                                <img src="https://res.cloudinary.com/dqhecj3tf/image/upload/v1718983649/houseRentSell/8380015_nysagd.jpg" alt="" className='h-[150px] w-[150px] rounded-3xl' />
                                <div className='text-lg flex flex-col justify-evenly'>
                                    <p className='font-semibold'>{property.seller.username}</p>
                                    <p>{property && property.seller.email}</p>
                                    <p>{property && property.seller.phone}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className='w-[90%] mx-auto lg:w-[397px] flex flex-col gap-5 '>
                    {property && property.companySellStatus !== "sold" && (property.userSellStatus === "sold" || property.userSellStatus === "none") && (
                        <div className='h-fit flex flex-col px-10 py-5 gap-5 bg-white rounded-2xl border border-1 border-black'>
                            <p className='font-semibold text-2xl'>Request for a Visit.</p>
                            {user && (
                                <form onSubmit={handleSubmit} action="POST" className='flex flex-col gap-5'>
                                    <input required value={user.username} type="text" name="name" placeholder='name..' className='px-5 py-2 rounded-2xl border border-1 border-black' />
                                    <input required value={user.phone} type="number" name="phone" placeholder='phone number...' className='px-5 py-2 rounded-2xl border border-1 border-black' />
                                    <input required value={user.email} type="email" name="email" placeholder='email..' className='px-5 py-2 rounded-2xl border border-1 border-black' />
                                    <input requied type="date" name="date" className='px-5 py-2 rounded-2xl border border-1 border-black' />
                                    <textarea name="message" id="message" className='px-5 py-2 rounded-2xl border border-1 border-black' placeholder='enter message..'></textarea>
                                    <button type="submit" className='bg-black text-white font-bold px-5 py-2 rounded-2xl'>Send Request</button>
                                </form>
                            )}
                        </div>
                    )}
                    {property && property.sellerType === "user" && user && user.memberId === "HRS12092002-1" && (
                        <div className='w-[100%] lg:w-[397px] h-fit flex px-10 py-5 gap-5 flex-col bg-white rounded-2xl border border-1 border-black'>
                            <p className='font-semibold text-2xl text-center'>Mark as ?</p>
                            <button onClick={() => handleMark("approved")} className='bg-green-950 text-white font-bold text-xl px-5 py-3'>Approved</button>
                            <button onClick={() => handleMark("rejected")} className='bg-red-700 text-white font-bold text-xl px-5 py-3'>Rejected</button>
                        </div>
                    )}
                    {property && property.userSellStatus === "pending" && user && markValue === "approved" && agents && (
                        <div className='w-[100%] lg:w-[397px] h-fit flex px-10 py-5 gap-5 flex-col bg-white rounded-2xl border border-1 border-black'>
                            <form onSubmit={handleApprove} action="POST" className='flex flex-col gap-5'>
                                <label for="agent" className='font-semibold text-2xl text-center'>Select Agent :-</label>
                                <select className='border border-black' name="agent" id="agent">
                                    <option value="" default>Select from list</option>
                                    {agents.map((agent, i) => {
                                        return <option key={i} value={agent.memberId}>{agent.name} - {agent.memberId}</option>
                                    })}
                                </select>
                                <button className='bg-black text-white py-2 font-bold text-xl'>Submit</button>
                            </form>
                        </div>
                    )}
                    {property && property.sellerType === "company" && user && user.memberId === "HRS12092002-1" && (
                        <div className='w-[100%] lg:w-[397px] h-fit flex px-10 py-5 gap-5 flex-col bg-white rounded-2xl border border-1 border-black'>
                            <p className='font-semibold text-2xl text-center'>Mark as ?</p>
                            <button onClick={() => handleMark("sold")} className='bg-green-950 text-white font-bold text-xl px-5 py-3'>Sold</button>
                            <button onClick={handleRemoveProperty} className='bg-red-700 text-white font-bold text-xl px-5 py-3'>Remove</button>
                        </div>
                    )}
                    {property && property.sellerType === "company" && property.companySellStatus === "pending" && markValue === "sold" && user && user.memberId === "HRS12092002-1" && (
                        <div className='w-[100%] lg:w-[397px] h-fit flex px-10 py-5 gap-5 flex-col bg-white rounded-2xl border border-1 border-black'>
                            <form onSubmit={handleSoldProperty} action="POST" className='flex flex-col gap-5'>
                                <label for="user" className='font-semibold text-2xl text-center'>Sold to who ? :-</label>
                                <select className='border border-black' name="owner" id="user">
                                    <option value="" default>Select from list</option>
                                    {applicableUsers && applicableUsers.map((agent, i) => {
                                        return <option key={i} value={agent._id}>{agent.username} - {agent.email}</option>
                                    })}
                                </select>
                                <button className='bg-black text-white py-2 font-bold text-xl'>Submit</button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default PropertyDetails;
