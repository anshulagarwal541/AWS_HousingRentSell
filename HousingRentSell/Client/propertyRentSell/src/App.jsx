import React, { useState, useEffect } from 'react'
import Home from './pages/home'
import AboutUs from './pages/AboutUs'
import Listing from './pages/Listing'
import AgentList from './pages/AgentList.jsx'
import LoginMember from './pages/LoginMember.jsx'
import Login from './pages/Login'
import ChatPage from './pages/ChatPage.jsx'
import Signup from './pages/Signup'
import PropertyImage from './components/property/PropertyImage'
import Dashboard from './pages/Dashboard'
import ChatDashboard from './pages/ChatDashboard.jsx'
import PropertyDetails from './pages/PropertyDetails'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { AuthContext } from './Helpers/AuthContext'
import AgentProfile from './pages/AgentProfile.jsx'
import PeopleChat from './pages/PeopleChat.jsx'
import ChatMessage from './components/ChatPage/ChatMessage.jsx'
import axios from 'axios'
import UpdateDetailsPage from './pages/UpdateDetailsPage.jsx'
import Queries from './pages/Queries.jsx';
import ApplicationPage from './pages/ApplicationPage.jsx'
import UserQuery from './pages/UserQuery.jsx'
import AddProperty from './pages/AddProperty.jsx'
import "./index.css";
import "./App.css";
import UserAddProperty from './pages/UserAddProperty.jsx'
import UserSellRequest from './pages/UserSellRequest.jsx'
import UserSellPost from './pages/UserSellPost.jsx'
import { gapi } from 'gapi-script'
const clientId = import.meta.env.VITE_CLIENTID;


function App() {
  const url=import.meta.env.VITE_DB || `${window.location.protocol}//${window.location.hostname}:3000`;
  const [user, setUser] = useState(null);
  const [member, setMember] = useState(null);
  const [employee, setEmployee] = useState(null);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [notLoggedIn, setNotLoggedIn] = useState(false);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null)
  const [alertType, setAlertType] = useState(null)
  useEffect(() => {
    const a = localStorage.getItem('accessToken');
    setUser(a);
  }, [user])
  useEffect(() => {
    const a = localStorage.getItem('accessMemberToken');
    setMember(a);
  }, [member])

  const handleLoginSuccess = (res) => {
    console.log("logged in = ", res)
  }

  const handleLoginError = (res) => {
    console.log("failure = ", res)
  }


  return (
      <div className='bg-[#ffffff]'>
        <AuthContext.Provider
          value={{
            alertType,
            setAlertType,
            alertMessage,
            setAlertMessage,
            alert,
            setAlert,
            user,
            setUser,
            member,
            setMember,
            employee,
            setEmployee,
            notLoggedIn,
            setNotLoggedIn,
            loginSuccess,
            setLoginSuccess,
            url
          }}>
          <Router>
            <Dashboard>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="listing" element={<Listing />} />
                <Route path="about" element={<AboutUs />} />
                <Route path="property/:id" element={<PropertyDetails />} />
                <Route path="property/:id/images" element={<PropertyImage />} />
                <Route path="login" element={<Login />} />
                <Route path="loginMember" element={<LoginMember />} />
                <Route path="signup" element={<Signup />} />
                <Route path="agentList" element={<AgentList />} />
                <Route path="agent/:id" element={<AgentProfile />} />
                <Route path="/chat" element={<ChatDashboard />} />
                <Route path='/chat/:id' element={<ChatDashboard><ChatMessage /></ChatDashboard>} />
                <Route path='/peopleChat' element={<PeopleChat />} />
                <Route path="/updateDetails" element={<UpdateDetailsPage />} />
                <Route path="/queries" element={<Queries />} />
                <Route path="/applications" element={<ApplicationPage />} />
                <Route path="/user/:id" element={<UserQuery />} />
                <Route path="/addProperty" element={<AddProperty />} />
                <Route path="/userAddProperty" element={<UserAddProperty />} />
                <Route path="/userSellRequest" element={<UserSellRequest />} />
                <Route path="/userAddProperty/sellData" element={<UserSellPost />} />
              </Routes>
            </Dashboard>
          </Router>
        </AuthContext.Provider>
      </div>
  )
}

export default App
