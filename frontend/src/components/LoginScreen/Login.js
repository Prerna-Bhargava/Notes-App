import axios from 'axios'
import React, { useState} from 'react'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import AlertMessage from '../Alerts/AlertMessage'
import MainScreen from '../MainScreen'
import Spinner from '../Loading'

import './Login.css'

const Login = () => {
    const history = useNavigate();
    const [email, setMail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)

    const submitForm = async (e) => {
        e.preventDefault();

        try {
            const config = {
                headers: {
                    "Content-type": "application/json"
                }
            }
            setLoading(true)
            const { data } = await axios.post('/api/users/login', { email, password }, config)
            localStorage.setItem('userInfo', JSON.stringify(data))
            history("/mynotes");
            setError(false)
            setLoading(false)

        } catch (err) {
            console.log(err)
            setError(err.response.data.message)
            console.log(err.response.data.message)
            setLoading(false)
        }

    }

    return (
        <MainScreen title='LOGIN'>

            <div className='loginContainer'>
                {loading && <Spinner />}
                {error && <AlertMessage variant='danger' msg={error} />}
                <Form onSubmit={submitForm}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" value={email} onChange={(e) => setMail(e.target.value)} placeholder="Enter email" />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                    </Form.Group>

                    <Button variant="primary mt-2" type="submit" >
                        Submit
                    </Button>

                    <Row className="py-3">
                        <Col>
                            New Customer ? <Link to="/register" >Register Here </Link>
                        </Col>
                    </Row>
                </Form>
            </div>

        </MainScreen>
    )
}

export default Login