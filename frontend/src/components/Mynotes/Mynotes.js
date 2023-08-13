import { React, useEffect, useState } from 'react'
import { Accordion, Badge, Button, Card } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import MainScreen from '../MainScreen';
import ReactMarkdown from "react-markdown";
import ErrorMessage from "../Alerts/AlertMessage";
import axios from 'axios'
import Spinner from '../Loading'
import { NOTES_DELETE_FAIL } from '../constants/noteConstants';

const Mynotes = () => {
  const history = useNavigate();
  const [notes, setmyNotes] = useState([])
  const [userInfo, setUserInfo] = useState('');
  const [message, setMessage] = useState('')
  const [noteDeleted, setNoteDeletion] = useState(false)
  const [loading, setloading] = useState(false)

  const deleteNote = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        const token = JSON.parse(localStorage.getItem("userInfo")).token
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
        await axios.delete(`/api/notes/${id}`, config)
        setNoteDeletion(true)

      } catch (err) {
        setMessage(NOTES_DELETE_FAIL)
      }
    }
  };

  const fetchNotes = async () => {
    const token = JSON.parse(localStorage.getItem("userInfo")).token
    setUserInfo(JSON.parse(localStorage.getItem("userInfo")));
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
    setloading(true)
    const { data } = await axios.get('/api/notes/', config);
    setloading(false)
    setmyNotes(data)

  }
  const isUserAuthenticated = async (userInfo) => {
    try {
      await axios.get(`/api/users/${userInfo.token}`)
      fetchNotes()
    } catch (e) {
      history("/");
    }
  }
  useEffect(() => {
    const userdata = JSON.parse(localStorage.getItem("userInfo"))
    if (userdata) {
      isUserAuthenticated(userdata)
    }
  }, [noteDeleted])


  return (
    <>

      {userInfo != '' && <MainScreen MainScreen title={`Welcome back ${userInfo.name}...`}>

        <Link to="/createnote">
          <Button className='createbtn'>
            CREATE NEW NOTE
          </Button>
        </Link>
        {loading && <Spinner />}

        {message != '' && <ErrorMessage variant="danger" msg={message}></ErrorMessage>}

        {
          notes.map(note => (
            <Accordion key={note._id}>
              <Accordion.Item eventkey="0">

                <Card style={{ marign: 10 }}>
                  <Accordion.Header as={Card.Text} variant="link" eventkey="0">
                    <Card.Header style={{ display: "flex", width: "100%" }}>
                      <span className='card-title'>{note.title}</span>
                      <div>
                        <Button href={`/note/${note._id}`} className='mx-2'>Edit</Button>
                        <Button variant='danger' className='mx-2' onClick={() => deleteNote(note._id)}>Delete</Button>
                      </div>
                    </Card.Header>
                  </Accordion.Header>

                  <Accordion.Body eventkey='0'>
                    <Card.Body>
                      <h4>
                        <Badge bg="success"> Category  - {note.category}</Badge>
                      </h4>
                      <blockquote className="blockquote mb-0">
                        <ReactMarkdown>{note.content}</ReactMarkdown>
                        <footer className="blockquote-footer">
                          Created on  {" "}
                          <cite title='Source Title'>
                            {note.createdAt.substring(0, 10)}
                          </cite>
                        </footer>
                      </blockquote>
                    </Card.Body>
                  </Accordion.Body>

                </Card>
              </Accordion.Item>
            </Accordion>

          ))
        }

      </MainScreen>}
    </>

  )
}

export default Mynotes