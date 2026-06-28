import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PropertyCard from "../components/home/PropertyCard.jsx";
import Profile from '../components/AgentDetails/Profile.jsx';
import AgentExperience from '../components/AgentDetails/AgentExperience.jsx';
import ReviewSection from '../components/AgentDetails/ReviewSection.jsx';
import { AuthContext } from '../Helpers/AuthContext.js';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

function AgentProfile() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const { id } = useParams();
    const [teamMember, setTeamMember] = useState(null);
    const [memberProperty, setMemberProperty] = useState(null);
    const { setNotLoggedIn, url, setAlert, setAlertMessage, setAlertType } = useContext(AuthContext);
    const [end, setEnd] = useState(6);
    const [popup, setPopUp] = useState(false);
    const [open, setOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [assignedHouse, setAssignedHouse] = useState(null);

    useEffect(() => {
        axios.get(`${url}/team/${id}`).then((response) => {
            if (!response.data.error) {
                setTeamMember(response.data);
                const assignedHouses = response.data.assignedHouses.filter((p) => (p.sellerType === "company" && p.companySellStatus === "pending"));
                setMemberProperty(assignedHouses.slice(0, 3));
                setAssignedHouse(assignedHouses);
            } else {
                setAlert(true)
                setAlertMessage(response.data.error)
                setAlertType("error");
            }
        });

        axios.get(`${url}/getUser`, {
            headers: {
                accessToken: localStorage.getItem("accessToken")
            }
        }).then((response) => {
            if (!response.data.error) {
                setUser(response.data);
            } else {
                axios.get(`${url}/getMember`, {
                    headers: {
                        accessMemberToken: localStorage.getItem('accessMemberToken')
                    }
                }).then((response) => {
                    if (!response.data.error) {
                        setUser(response.data);
                    } else {
                        setNotLoggedIn(true);
                        navigate('/login');
                    }
                });
            }
        });

    }, [id, url, navigate, setNotLoggedIn]);

    const handleLoad = () => {
        setMemberProperty(assignedHouse.slice(0, end));
        setEnd(end + 3);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    return (
        <AuthContext.Provider value={{ url, teamMember, setTeamMember, id, setOpen, setErrorMessage, setAlert, setAlertMessage, setAlertType }}>
            <div className='bg-[#fff7f0] py-10'>
                <div>
                    <img src="https://images.unsplash.com/photo-1508700759590-0153aa32e79f?q=80&w=2832&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                         alt="Cover" 
                         className='object-cover h-[300px] md:h-[500px] w-full' />
                </div>
                {teamMember && (
                    <Profile teamMember={teamMember} />
                )}
                <div className='w-[90%] mx-auto mt-5'>
                    <ul className='flex justify-center gap-5 md:gap-10 flex-wrap'>
                        <li className='text-black px-4 py-2 md:px-5 md:py-3 rounded-xl border border-black cursor-pointer hover:bg-gray-100'>For Rent</li>
                        <li className='bg-black text-white px-4 py-2 md:px-5 md:py-3 rounded-xl cursor-pointer hover:bg-gray-800'>For Sale</li>
                    </ul>
                    <div className='flex py-5 flex-col items-center'>
                        <div className='w-full flex flex-wrap gap-5 justify-center items-center py-10'>
                            {memberProperty && (
                                memberProperty.map((house, i) => (
                                    <PropertyCard key={i} property={house} />
                                ))
                            )}
                        </div>
                        {memberProperty && teamMember.assignedHouses && memberProperty.length !== teamMember.assignedHouses.length && (
                            <button onClick={handleLoad} className='bg-black text-white px-6 py-2 border border-white rounded hover:bg-gray-800 transition'>
                                Load More
                            </button>
                        )}
                    </div>
                </div>
                <AgentExperience />
                {user && teamMember && (
                    <div className='w-[90%] mx-auto bg-white border border-black rounded-2xl my-10'>
                        <ReviewSection user={user} />
                        <div className='py-2'>
                            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                                <Alert
                                    onClose={handleClose}
                                    severity="error"
                                    variant="filled"
                                    sx={{ width: '100%' }}
                                >
                                    {errorMessage}
                                </Alert>
                            </Snackbar>
                        </div>
                    </div>
                )}
            </div>
        </AuthContext.Provider>
    );
}

export default AgentProfile;
