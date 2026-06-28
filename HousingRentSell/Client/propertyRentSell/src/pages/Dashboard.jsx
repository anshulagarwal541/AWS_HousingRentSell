import React, { useContext } from 'react'
import NavBar from '../components/navBar'
import Footer from '../components/footer'
import { Snackbar, Alert } from '@mui/material'
import { AuthContext } from '../Helpers/AuthContext'
function Dashboard({ children }) {
    const { alert, setAlert, alertMessage, setAlertMessage, alertType, setAlertType } = useContext(AuthContext);

    const handleClose = () => {
        setAlertMessage(null)
        setAlertType(null)
        setAlert(false);
    }

    return (
        <div>
            <div>
                <NavBar />
            </div>
            <div>
                <Snackbar
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    open={alert}
                    autoHideDuration={3000}
                    onClose={handleClose}
                >
                    {alert && (
                        <Alert
                            onClose={handleClose}
                            severity={alertType}
                            variant="filled"
                            sx={{ width: '100%' }}
                        >
                            {alertMessage}
                        </Alert>
                    )}
                </Snackbar>
                {children}
            </div>
            <div>
                <Footer />
            </div>
        </div>
    )
}

export default Dashboard