import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import UpdateDetails from '../components/UpdateDetails/UpdateDetails';
import { AuthContext } from '../Helpers/AuthContext';
function UpdateDetailsPage() {
    const [employee, setEmployee] = useState(null);
    const { url, setAlert, setAlertType, setAlertMessage } = useContext(AuthContext)
    useEffect(() => {
        axios.get(`${url}/getTeam`, {
            headers: {
                accessMemberToken: localStorage.getItem('accessMemberToken')
            }
        }).then((response) => {
            if (!response.data.error) {
                setEmployee(response.data);
            }
            else {
                console.log("Opps error occured");
            }
        })
    }, [])
    return (
        <AuthContext.Provider value={{ url, setAlert, setAlertType, setAlertMessage }}>
            <div className='h-[100vh] px-2 flex justify-center items-center'>
                {employee && <UpdateDetails employee={employee} />}
            </div>
        </AuthContext.Provider>
    )
}

export default UpdateDetailsPage