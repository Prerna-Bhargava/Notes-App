import React, { useState } from 'react'
import MainScreen from '../MainScreen';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import AlertMessage from '../Alerts/AlertMessage';
import Spinner from '../Loading'
import axios from 'axios';
import { ERROR_OCCURED, PASSWORD_VERIFICATION_FAILED } from '../constants/noteConstants';

const Register = () => {

  const history = useNavigate();

  const [name, setName] = useState('')
  const [email, setMail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [pic, setPic] = useState(
    "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
  );
  const [message, setMessage] = useState(null);
  const [picmessage, setPicMessage] = useState(null);
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [picUploading, setPicUpload] = useState(false)

  const registerUser = async (e) => {
    e.preventDefault();

    if (password != confirmPassword) {
      setMessage(PASSWORD_VERIFICATION_FAILED);
    }
    else {
      setMessage(null);
      try {
        const config = {
          headers: {
            "Content-type": "application/json"
          }
        }
        setLoading(true)
        const { data } = await axios.post("/api/users", {
          name, pic, email, password
        }, config)
        localStorage.setItem('userInfo', JSON.stringify(data))
        setLoading(false)
        history("/mynotes");

      } catch (err) {
        setError(err.response.data.message)
        setLoading(false)
      }
    }
  };

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

  return (
    <MainScreen title='REGISTER'>

      <div className='loginContainer'>
        {loading && <Spinner />}
        {error && <AlertMessage variant='danger' msg={error}></AlertMessage>}
        {message && <AlertMessage variant='danger' msg={message}></AlertMessage>}
        <Form onSubmit={registerUser} >
          <Form.Group className="mb-3" controlId="name">
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

          <Button variant="primary mt-2" type="submit" disabled={picUploading} >
            Submit
          </Button>

          <Row className="py-3">
            <Col>
              Already Have an account ? <Link to="/login" >Login Here </Link>
            </Col>
          </Row>
        </Form>
      </div>

    </MainScreen>
  )
}

export default Register