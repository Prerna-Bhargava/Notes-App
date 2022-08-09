import React, { useEffect, useState } from "react";
import MainScreen from "../../components/MainScreen";
import { Button, Card, Form } from "react-bootstrap";
import ErrorMessage from "../Alerts/AlertMessage";
import ReactMarkdown from "react-markdown";
import axios from "axios";
import { useNavigate } from 'react-router-dom'


function CreateNote() {
    const history = useNavigate();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("");
    const [message, setMessage] = useState("")
    const [userInfo, setUserInfo] = useState('')


    const resetHandler = () => {
        setTitle("");
        setCategory("");
        setContent("");
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!title || !content || !category) {
            setMessage("Please fill all details.")
        }
        else {
            try {

                const token = JSON.parse(localStorage.getItem("userInfo")).token
                setUserInfo(JSON.parse(localStorage.getItem("userInfo")));
                console.log(token)
                const config = {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
                const { data } = await axios.post("api/notes/create", {
                    title, content, category
                }, config)

                resetHandler();
                history("/mynotes");

            } catch (err) {
                console.log(err)
                setMessage('Record Cannot be created')
            }
        }

    };

    useEffect(() => {

        if (JSON.parse(localStorage.getItem("userInfo"))) {
            setUserInfo(JSON.parse(localStorage.getItem("userInfo")));
        }
        else{
            history('/')
        }

    }, []);

    return (
        <>
            {userInfo != '' && <MainScreen title="Create a Note">
                <Card>
                    <Card.Header>Create a new Note</Card.Header>
                    <Card.Body>
                        <Form onSubmit={submitHandler}>
                            {message != '' && <ErrorMessage variant="danger" msg={message}></ErrorMessage>}
                            <Form.Group controlId="title">
                                <Form.Label>Title</Form.Label>
                                <Form.Control
                                    type="title"
                                    value={title}
                                    placeholder="Enter the title"
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </Form.Group>

                            <Form.Group controlId="content">
                                <Form.Label>Content</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    value={content}
                                    placeholder="Enter the content (React Markdown is accepted)"
                                    rows={4}
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
                                    value={category}
                                    placeholder="Enter the Category"
                                    onChange={(e) => setCategory(e.target.value)}
                                />
                            </Form.Group>
                            <Button type="submit" className="mt-3" variant="primary">
                                Create Note
                            </Button>
                            <Button className="mx-2 mt-3" onClick={resetHandler} variant="danger">
                                Reset Feilds
                            </Button>
                        </Form>
                    </Card.Body>

                    <Card.Footer className="text-muted">
                        Creating on - {new Date().toLocaleDateString()}
                    </Card.Footer>
                </Card>
            </MainScreen>}
        </>

    );
}

export default CreateNote;