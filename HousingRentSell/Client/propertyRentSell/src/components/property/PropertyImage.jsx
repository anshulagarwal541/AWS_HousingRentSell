import React, { useContext, useEffect, useState } from 'react'
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { useParams } from 'react-router-dom'
import axios from 'axios';
import { AuthContext } from '../../Helpers/AuthContext';

const PropertyImage = () => {
    const [images, setImages] = useState(null);
    const [partialImage, setPartialImage] = useState(null);
    const [end, setEnd] = useState(4);
    const { id } = useParams();
    const {url, alert, setAlert, alertMessage, setAlertMessage, alertType, setAlertType}=useContext(AuthContext)
    useEffect(() => {
        axios.get(`${url}/property/${id}/images`).then((response) => {
            if (!response.data.error) {
                setImages(response.data);
                setPartialImage(response.data.slice(0, 4));
            }else{
                setAlert(true)
                setAlertMessage(response.data.error)
                setAlertType("error");
            }
        })
    }, [])

    const loadMore = () => {
        setPartialImage(images.slice(0, end));
        setEnd(end + 4);
    }

    return (
        <div className='flex flex-col items-center justify-center gap-10 py-5'>
            <div className='flex flex-row flex-wrap gap-5 items-center justify-center'>
                {partialImage && partialImage.map((image, i) => {
                    return <div key={i} >
                        <img src={image} alt="" className='w-[300px]'/>
                    </div>
                })}

            </div>
            {partialImage && images && partialImage.length === images.length ? "" : <button onClick={loadMore} className='bg-black text-white rounded-xl px-5 py-3 font-bold text-xl'>Load More</button>}
        </div>
    )
}

export default PropertyImage;