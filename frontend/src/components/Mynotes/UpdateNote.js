import React, { useEffect, useState } from "react";
import MainScreen from "../../components/MainScreen";
import axios from "axios";
import { Button, Card, Form } from "react-bootstrap";
import ErrorMessage from "../Alerts/AlertMessage";
import ReactMarkdown from "react-markdown";
import { useNavigate, useParams } from 'react-router-dom'
import { FILL_DETAILS, NOTES_DELETE_SUCCESS, NOTE_NOT_CREATED } from "../constants/noteConstants";

function UpdateNote({ }) {
    const history = useNavigate();
    let id = (useParams().id)
    const [message, setMessage] = useState("")
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState("");
    const [config, setConfig] = useState({})

    useEffect(() => {
        if (JSON.parse(localStorage.getItem("userInfo"))) {
            const fetching = async () => {
                const token = JSON.parse(localStorage.getItem("userInfo")).token
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
                setConfig(config)
                const { data } = await axios.get(`/api/notes/${id}`, config);
                setTitle(data.title);
                setContent(data.content);
                setCategory(data.category);
                setDate(data.updatedAt);
            };
            fetching();
        }
        else {
            history('/')
        }

    }, [date,history]);

    const deleteHandler = async (id) => {
        try {
            await axios.delete(`/api/notes/${id}`, config)
            resetHandler();
            history("/mynotes");

        } catch (err) {
            setMessage(NOTES_DELETE_SUCCESS)
        }
    };

    const resetHandler = () => {
        setTitle("");
        setCategory("");
        setContent("");
    };

    const updateHandler = async (e) => {
        e.preventDefault();
        if (!title || !content || !category) {
            setMessage(FILL_DETAILS)
        }
        else {
            try {
                const token = JSON.parse(localStorage.getItem("userInfo")).token
                const config = {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
                const { data } = await axios.put(`/api/notes/${id}`, {
                    title, content, category
                }, config)

                resetHandler();
                history("/mynotes");

            } catch (err) {
                setMessage(NOTE_NOT_CREATED)
            }
        }
    };

    return (
        <MainScreen title="Edit Note">
            <Card>
                <Card.Header>Edit your Note</Card.Header>
                <Card.Body>
                    <Form onSubmit={updateHandler}>
                        {message && <ErrorMessage variant="danger" msg={message}></ErrorMessage>}
                        <Form.Group controlId="title">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="title"
                                placeholder="Enter the title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId="content">
                            <Form.Label>Content</Form.Label>
                            <Form.Control
                                as="textarea"
                                placeholder="Enter the content"
                                rows={4}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />
                        </Form.Group>
                        {content && (
                            <Card>
                                <Card.Header>Note Preview</Card.Header>
                                <Card.Body>
                                    <ReactMarkdown>{content}</ReactMarkdown>
                                </Card.Body>
                            </Card>
                        )}

                        <Form.Group controlId="content">
                            <Form.Label>Category</Form.Label>
                            <Form.Control
                                type="content"
                                placeholder="Enter the Category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            />
                        </Form.Group>
                        {/* {loading && <Loading size={50} />} */}
                        <Button variant="primary" className="mt-3" type="submit">
                            Update Note
                        </Button>
                        <Button
                            className="mx-2 mt-3"
                            variant="danger"
                            onClick={() => deleteHandler(id)}
                        >
                            Delete Note
                        </Button>
                    </Form>
                </Card.Body>

                <Card.Footer className="text-muted">
                    Updated on - {date.substring(0, 10)}
                </Card.Footer>
            </Card>
        </MainScreen>
    );
}

export default UpdateNote;