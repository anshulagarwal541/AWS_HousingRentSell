import React, { useState, useEffect, useContext } from 'react'
import News from './home/News'
import { AuthContext } from '../Helpers/AuthContext';
import axios from 'axios';

function Footer() {
    const { user, url } = useContext(AuthContext);
    const [users, setUsers] = useState(null);
    useEffect(() => {
        axios.get(`${url}/getUser`, {
            headers: {
                accessToken: localStorage.getItem('accessToken')
            }
        }).then((response) => {
            if (response.data.error) {
                console.log(response.data.error)
                setUsers(null);
            }
            else {
                setUsers(response.data);
            }
        })
    }, [user])

    return (
        <AuthContext.Provider value={{ users, url }}>
            <div>
                <News />
            </div>
        </AuthContext.Provider>
    )
}

export default Footer