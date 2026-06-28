import React from 'react'
import profilePic from "../../assets/profilePic.jpg"
import mapLocate from "../../assets/mapLocate.svg";
import family from "../../assets/family.svg";
import room from "../../assets/room.svg";
import bath from "../../assets/bath.svg";
import sqft from "../../assets/sqft.svg";
import { Link } from 'react-router-dom';

function PropertyCard({ property }) {
    return (
        <div className='bg-[#fff9f6] w-full md:w-1/2 lg:w-1/4 pb-5 flex flex-col gap-8 justify-between items-center border border-3 text-[#626262] font-bold border-red-100 rounded-3xl'>
            <img src="https://img.onmanorama.com/content/dam/mm/en/lifestyle/decor/images/2023/6/1/house-middleclass.jpg" alt="" className='h-[260px] w-full rounded-t-3xl object-cover' />
            <div className='w-[90%] flex flex-row gap-5'>
                <img src={mapLocate} alt="" />
                <p>
                    {property.address}
                </p>
            </div>
            <div className='w-[90%] flex flex-row justify-between'>
                <div className='flex flex-row gap-5'>
                    <img src={room} alt="" />
                    <div>
                        <p>
                            {property.rooms} bed
                        </p>
                        <p>rooms</p>
                    </div>
                </div>
                <div className='flex flex-row gap-5'>
                    <img src={bath} alt="" />
                    <div>
                        <p>
                            {property.bath}
                        </p>
                        <p>
                            Bath
                        </p>
                    </div>
                </div>
            </div>
            <div className='w-[90%] flex flex-row justify-between'>
                <div className='flex flex-row gap-5'>
                    <img src={sqft} alt="" />
                    <div>
                        <p>
                            {property.area}
                        </p>
                        <p>sqft</p>
                    </div>
                </div>
                <div className='flex flex-row gap-5 items-center'>
                    <img src={family} alt="" className='w-[20px]' />
                    <p>
                        family
                    </p>
                </div>
            </div>
            <div className='w-[90%] flex flex-col sm:flex-row gap-5 items-center justify-between'>
                <Link to={`/property/${property._id}`} className='bg-black text-white px-8 py-3 rounded-2xl w-full sm:w-auto text-center'>
                    View Details
                </Link>
                <p className='text-black font-bold text-xl'>
                    $ {property.totalPrice}
                </p>
            </div>
        </div>
    )
}

export default PropertyCard;
