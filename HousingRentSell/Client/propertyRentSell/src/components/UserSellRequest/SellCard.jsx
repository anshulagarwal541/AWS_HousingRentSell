import { accessToken } from 'mapbox-gl';
import React, { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../Helpers/AuthContext';
import axios from 'axios';
function SellCard({ house, user, agent }) {
  const { setAlert, setAlertMessage, setAlertType, setHouses, url } = useContext(AuthContext)

  const handleApprove = (e) => {
    e.preventDefault();
    axios.post(`${url}/approveCompanyRequest`,
      {
        houseId: house._id,
      },
      {
        headers: {
          accessToken: localStorage.getItem('accessToken')
        }
      }).then((response) => {
        if (!response.data.error) {
          setAlertType('success');
          setHouses(response.data);
          setAlertMessage("You have successfully accepted the company's request for buying the house. Now you no longer own this house..");
          setAlert(true);
        }
        else {
          setAlertType('error');
          setAlertMessage(response.data.error);
          setAlert(true);
        }
      })
  }

  const handleReject = (e) => {
    e.preventDefault();
    axios.post(`${url}/rejectCompanyRequest`, { houseId: house._id }, {
      headers: {
        accessToken: localStorage.getItem('accessToken')
      }
    }).then((response) => {
      if (!response.data.error) {
        setAlertType('success');
        setHouses(response.data);
        setAlertMessage("You have successfully rejected the company's request for buying the house..");
        setAlert(true);
      }
      else {
        setAlertType('error');
        setAlertMessage(response.data.error);
        setAlert(true);
      }
    })
  }

  return (
    <div className='flex flex-col sm:flex-row bg-[#fff9f5] w-full sm:w-[90%] md:w-[70%] rounded-2xl mx-auto p-3'>
      <div className='w-full sm:w-[40%] flex justify-center items-center'>
        <img src={house.images[0]} alt="" className='rounded-2xl h-[12rem] sm:h-[16rem]' />
      </div>
      <div className='w-full sm:w-[60%] flex flex-col gap-2 px-2 sm:px-10'>
        <p className='font-bold'>Address :- 👇</p>
        <p>{house.address}</p>

        {house && house.userSellStatus !== "none" && (
          <div className='w-full'>
            <p className='font-bold'>Seller Contact Details 👇 :-</p>
            <p><span className='font-bold'>Name</span> :- {house.seller.username}</p>
            <p><span className='font-bold'>Phone</span> :- {house.seller.phone}</p>
            <p><span className='font-bold'>Email</span> :- {house.seller.email}</p>
          </div>
        )}

        {house && house.userSellStatus === "none" && house.companySellStatus === "sold" && (
          <div className='w-full'>
            <p><span className='font-bold'>Company Name</span> :- Rachit's Property (Sell, Rent & Buy)</p>
            <p className='font-bold'>Agent's Details 👇</p>
            <p><span className='font-bold'>Name</span> :- {house.agent.name}</p>
            <p><span className='font-bold'>Phone</span> :- {house.agent.phone}</p>
            <p><span className='font-bold'>Email</span> :- {house.agent.email}</p>
          </div>
        )}

        <div className='flex justify-between items-center flex-wrap'>
          <Link to={`/property/${house._id}`}>
            <button className='bg-black text-white font-bold w-fit px-3 sm:px-5 py-2 '>Learn More</button>
          </Link>
          {house.userSellStatus === "pending" ?
            (<p className='text-red-600 border-2 border-red-600 px-3 sm:px-5 py-3 rounded w-fit font-bold'>Pending..</p>)
            : house.userSellStatus === "waiting" ?
              (
                <div className='flex w-full sm:w-auto gap-2'>
                  {agent ? (
                    <p className='text-orange-400 border-2 border-orange-400 px-3 sm:px-5 py-3 rounded w-fit font-bold'>Waiting..</p>
                  ) : (
                    user && (
                      <div className='flex w-full sm:w-auto gap-2'>
                        <button onClick={handleApprove} className='bg-green-950 text-white font-bold py-2 px-3 sm:px-5 w-fit'>Approve</button>
                        <button onClick={handleReject} className='bg-red-600 text-white font-bold py-3 px-3 sm:px-5 w-fit'>Reject</button>
                        <p className='text-orange-400 border-2 border-orange-400 px-3 sm:px-5 py-3 rounded w-fit font-bold'>Waiting..</p>
                      </div>
                    )
                  )}
                </div>
              )
              : house.userSellStatus === "sold" ?
                (<p className='text-green-950 border-2 border-green-950 px-3 sm:px-5 py-3 rounded w-fit font-bold'>Sold</p>)
                : house.userSellStatus === "rejected" ?
                  (<p className='text-red-600 border-2 border-red-600 px-3 sm:px-5 py-3 rounded w-fit font-bold'>Rejected</p>)
                  : ""}
          {house && house.sellerType === "company" && house.companySellStatus === "sold" && (
            <p className='text-green-950 border-2 border-green-950 px-3 sm:px-5 py-3 rounded w-fit text-xl font-bold'>Bought</p>
          )}
        </div>
      </div>
    </div>

  )
}

export default SellCard