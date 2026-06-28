import React, { useState, useEffect, useContext } from 'react';
import QueryCard from '../components/Queries/QueryCard';
import axios from 'axios';
import { AuthContext } from '../Helpers/AuthContext';
import { Alert, Snackbar } from '@mui/material';

function Queries() {
    const [button, setButton] = useState("pending");
    const [queries, setQueries] = useState();
    const { url, alertType,
        setAlertType,
        alertMessage,
        setAlertMessage,
        alert,
        setAlert } = useContext(AuthContext);

    useEffect(() => {
        const data = { status: "pending" };
        axios.post(`${url}/getQueriesTeam`, data, {
            headers: {
                accessMemberToken: localStorage.getItem('accessMemberToken')
            }
        }).then((response) => {
            if (!response.data.error) {
                setQueries(response.data);
            } else {
                setAlert(true)
                setAlertMessage(response.data.error)
                setAlertType("error");
            }
        });
    }, [url]);

    const handleClick = (option) => {
        const data = { status: option };
        axios.post(`${url}/getQueriesTeam`, data, {
            headers: {
                accessMemberToken: localStorage.getItem('accessMemberToken')
            }
        }).then((response) => {
            if (!response.data.error) {
                setQueries(response.data);
            } else {
                setAlert(true);
                setAlertMessage(response.data.error);
                setAlertType("error");
            }
        });
        setButton(option);
    };

    const handleClose =  ()=>{
        setAlert(false);
        setAlertMessage(null);
        setAlertType(null);
    };

    return (
        <AuthContext.Provider value={{
            setQueries, url, alertType,
            setAlertType,
            alertMessage,
            setAlertMessage,
            alert,
            setAlert
        }}>
            <div className="bg-[#ffe0ce] py-5 min-h-screen">
                {alert && (
                    <Snackbar
                        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                        open={alert}
                        autoHideDuration={3000}
                        onClose={handleClose}
                        key={'top' + 'center'}
                    >
                        <Alert
                            onClose={handleClose}
                            severity={alertType}
                            variant="filled"
                            sx={{ width: '100%' }}
                        >
                            {alertMessage}
                        </Alert>
                    </Snackbar>
                )}
                <p className="text-2xl lg:text-4xl font-bold text-center">Queries Section</p>

                {/* Button Group */}
                <div className="flex justify-center items-center gap-5 py-5 flex-wrap">
                    <button
                        onClick={() => handleClick("pending")}
                        className={`${button === "pending" ? "bg-white text-red-500 border-2 border-red-500" : "bg-red-500 text-white"} font-bold text-lg lg:text-2xl rounded-xl px-5 py-2`}
                    >
                        Pending
                    </button>
                    <button
                        onClick={() => handleClick("resolved")}
                        className={`${button === "resolved" ? "bg-white text-green-950 border-2 border-green-950" : "bg-green-950 text-white"} font-bold text-lg lg:text-2xl rounded-xl px-5 py-2`}
                    >
                        Resolved
                    </button>
                </div>

                {/* Query List */}
                <div className="w-full flex flex-col items-center">
                    {(queries && queries.length) ? (
                        <div className="flex flex-col gap-5 w-full px-2 lg:px-0 lg:w-3/4">
                            {queries.map((query, i) => (
                                <QueryCard key={i} query={query} />
                            ))}
                        </div>
                    ) : (
                        <div className="w-3/4 mx-auto bg-[#fff9f5] text-center font-bold text-xl lg:text-3xl h-[10rem] rounded-xl flex items-center justify-center">
                            No queries found
                        </div>
                    )}
                </div>
            </div>
        </AuthContext.Provider>
    );
}

export default Queries;
