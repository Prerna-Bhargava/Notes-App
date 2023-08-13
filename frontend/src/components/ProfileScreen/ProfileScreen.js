import React, { useEffect, useState } from 'react'
import { Row, Col, Button, Form } from 'react-bootstrap'
import AlertMessage from '../Alerts/AlertMessage'
import MainScreen from '../MainScreen';
import Spinner from '../Loading'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ProfileScreen.css'
import { ERROR_OCCURED, PASSWORD_VERIFICATION_FAILED, PROFILE_UPDATED } from '../constants/noteConstants';


const ProfileScreen = () => {
    const history = useNavigate();
    const [name, setName] = useState('')
    const [email, setMail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [pic, setPic] = useState("");
    const [picmessage, setPicMessage] = useState(null);
    const [loading, setLoading] = useState(false)
    const [picUploading, setPicUpload] = useState(false);
    const [userInfo, setUserInfo] = useState('');
    const [message, setMessage] = useState(null);
    const [sucess, setSucess] = useState(false)



    const postDetails = (picture) => {
        setPicMessage(null)

        if (!picture) {
            return setPicMessage('Please Select an Image1');
        }

        if (picture.type == 'image/jpeg' || picture.type == 'image/png') {
            setPicUpload(true)
            const data = new FormData();
            data.append('file', picture)
            data.append('upload_preset', 'NotesApp')
            data.append('cloud_name', 'dlqtgcsk9')
            fetch('https://api.cloudinary.com/v1_1/dlqtgcsk9/image/upload', {
                method: "post",
                body: data,
            }).then((res) => res.json()).then((data) => {
                setPic(data.url.toString())
                setPicUpload(false)
            })
                .catch((err) => {
                    return setPicMessage(ERROR_OCCURED)

                });

            const reader = new FileReader();
            reader.readAsDataURL(picture);

        }

        else {
            return setPicMessage('Please Select an Image2')
        }

    }
    const submitForm = async (e) => {
        e.preventDefault();
        if (password != confirmPassword) {
            setMessage(PASSWORD_VERIFICATION_FAILED);
        }
        else {
            try {
                const token = JSON.parse(localStorage.getItem("userInfo")).token
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
                setLoading(true)
                const { data } = await axios.post("api/users/profile", {
                    name, pic, email, password
                }, config)
                localStorage.setItem('userInfo', JSON.stringify(data))
                setSucess(true)
                setMessage(PROFILE_UPDATED)
                setLoading(false);

            } catch (err) {
                setLoading(false)
            }
        }
    }
    useEffect(() => {
        if (JSON.parse(localStorage.getItem("userInfo"))) {
            setUserInfo(JSON.parse(localStorage.getItem("userInfo")));
        }
        else {
            history("/")
        }
    }, [history])
    useEffect(() => {
        setName(userInfo.name)
        setMail(userInfo.email);
        setPic(userInfo.pic);
    }, [userInfo])

    return <MainScreen title="Edit Profile">


        <div>
            <Row className='profileContainer'>
                <Col md={6} ms={12}>
                    <Form onSubmit={submitForm}>
                        {loading && <Spinner />}
                        {message && <AlertMessage variant={sucess ? 'success' : 'danger'} msg={message}></AlertMessage>}


                        <Form.Group controlId="name">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter name" />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control type="email" value={email} onChange={(e) => setMail(e.target.value)} placeholder="Enter Email" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="confirmPassword">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" />
                        </Form.Group>

                        {picmessage && <AlertMessage variant='danger' msg={picmessage}></AlertMessage>}
                        {picUploading && <AlertMessage variant='primary' msg="Image Uploading"></AlertMessage>}
                        <Form.Group className="mb-3" controlId="pic">
                            <Form.Label>Profile Picture</Form.Label>
                            <Form.Control type="file" onChange={(e) => postDetails(e.target.files[0])} />
                        </Form.Group>

                        <Button variant="primary mt-2 mb-3" type="submit" disabled={picUploading} >
                            Submit
                        </Button>
                    </Form>
                </Col>
                <Col > 
                    <img src={pic} alt={name} className='profilePic'  />
                </Col>
            </Row>
        </div>

    </MainScreen>
}

export default ProfileScreen