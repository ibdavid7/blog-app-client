import React, {useEffect, useState} from "react";
import {Modal, Button, Form} from "react-bootstrap";
import {gql, useMutation} from "@apollo/client";
import {GET_PROFILE} from "../../pages/Profile/Profile";

const CREATE_POST = gql`
    mutation createPost ($title: String!, $content: String!) {
        postCreate(post: {title: $title, content: $content}) {
            userErrors {
                message
            }
            post {
                title
                content
                createdAt
                published
                user {
                    name
                }
            }
        }
    }
`;

export default function AddPostModal() {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");
    const [errors, setErrors] = useState([]);

    const [postCreate, {data, loading}] = useMutation(CREATE_POST, {
        refetchQueries: [
            GET_PROFILE, // DocumentNode object parsed with gql
            'profile' // Query name
        ],
    });

    useEffect(() => {

        if (data?.postCreate?.userErrors?.length) {
            const errors = data.postCreate.userErrors.map(e => <p style={{color: 'red'}}>{e.message}</p>);
            setErrors(errors);
        }


    }, [data])

    const handleClick = () => {

        if (!(title && content)) {
            return;
        }

        postCreate({
            variables: {
                title,
                content,
            }
        })

        setShow(false);
        setContent("");
        setTitle("");
        setErrors([]);

    };

    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                Add Post
            </Button>

            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Add Post</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder=""
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group
                            className="mb-3"
                            controlId="exampleForm.ControlTextarea1"
                        >
                            <Form.Label>Content</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    {errors && <div>{errors}</div>}
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleClick}>
                        Add
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
