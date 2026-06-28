import { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import PropertyCard from './PropertyCard';
import { AuthContext } from '../../Helpers/AuthContext';

function Property() {
    const { setAlert, setAlertMessage, setAlertType, url } = useContext(AuthContext);
    const [properties, setProperties] = useState(null);
    const [category, setCategory] = useState("residential");

    useEffect(() => {
        axios.get(`${url}/properties`).then((response) => {
            const property = response.data.filter((house) => house.category === "residential")
            setProperties(property);
        });
    }, [url]);

    const updateCategory = (d) => {
        setCategory(d);
        const data = {
            category: d
        }
        axios.post(`${url}/propertyCategory`, data).then((response) => {
            if (!response.data.error) {
                setProperties(response.data);
            }
            else {
                setAlertMessage(response.data.error);
                setAlertType('error');
                setAlert(true);
            }
        })
    }

    return (
        <div className="py-10 px-3">
            <div className='flex flex-col md:flex-row justify-between items-center w-full md:w-[80%] mx-auto'>
                <p className='font-bold text-3xl md:text-5xl'>
                    Featured Properties
                </p>
                <p className='text-orange-700 font-bold text-xl md:text-2xl mt-4 md:mt-0'>
                    Explore More 👉
                </p>
            </div>
            <div className='flex flex-col md:flex-row w-full md:w-[80%] mx-auto justify-around items-center text-lg md:text-2xl py-10'>
                <button id="residential" className={`hover:font-bold ${category == "residential" ? 'font-bold' : ''} py-2 px-4`} onClick={() => updateCategory("residential")}>Residential</button>
                <button id="industrial" className={`hover:font-bold ${category == "industrial" ? 'font-bold' : ''} py-2 px-4`} onClick={() => updateCategory("industrial")}>Industrial</button>
                <button id="commercial" className={`hover:font-bold ${category == "commercial" ? 'font-bold' : ''} py-2 px-4`} onClick={() => updateCategory("commercial")}>Commercial</button>
            </div>
            <div className='flex flex-col md:flex-row flex-wrap justify-center gap-5'>
                {properties && properties.map((property, i) => (
                    <PropertyCard key={i} property={property} />
                ))}
            </div>
        </div>
    )
}

export default Property;
