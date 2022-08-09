import React from 'react'
import { Alert } from 'react-bootstrap'
const AlertMessage = ({ variant = 'info',msg,height=40}) => {
    return (
        <div>
            <Alert key={variant} variant={variant} style={{ fontSize: 18,paddingTop: 7,height:height }}>
                <strong>{msg}</strong>
            </Alert>

        </div>
    )
}

export default AlertMessage