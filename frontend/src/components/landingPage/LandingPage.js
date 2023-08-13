import { React, useEffect } from 'react'
import './LandingPage.css'
import { Button, Container, Row } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export const LandingPage = () => {

    const history = useNavigate();
    const isUserAuthenticated = async (userInfo) => {
        try {
            await axios.get(`/api/users/${userInfo.token}`)
            history("/mynotes");

        } catch (e) {
        }
    }
    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        if (userInfo) {
            isUserAuthenticated(userInfo);
        }
    }, [])

    return (
        <div className='main'>
            <Container>
                <Row>
                    <div className='intro-text'>
                        <div>
                            <h1 className='title'>Welcome to Notes APP</h1>
                            <p className='subtitle'>One safe place for all your notes</p>

                        </div>

                        <div className='buttons'>
                            <a href='/login'>
                                <Button>Login</Button>
                            </a>

                            <a href='/register'>
                                <Button className='' variant='outline-primary' >SignUp</Button>
                            </a>
                        </div>


                    </div>
                </Row>
            </Container>

        </div>
    )
}
