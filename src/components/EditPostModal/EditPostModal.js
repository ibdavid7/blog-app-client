import React, {useEffect, useState} from "react";
import {Modal, Button, Form} from "react-bootstrap";
import {gql, useMutation} from "@apollo/client";

const UPDATE_POST = gql`
    mutation postUpdatet($postId: ID!, $title: String!, $content: String!) {
        postUpdate(postId: $postId, post: {title: $title, content: $content}) {
            userErrors {
                message
            }

            post {
                id
                title
                content
            }
        }
    }
`;

export default function EditPostModal({
                                          postId,
                                          title,
                                          content,
                                      }) {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [contentProp, setContent] = useState(content);
    const [titleProp, setTitle] = useState(title);
    const [errors, setErrors] = useState([]);

    const [postUpdate, {data, loading}] = useMutation(UPDATE_POST);

    useEffect(() => {

        if (data?.postUpdate?.userErrors?.length) {
            const errors = data.postUpdate.userErrors.map(e => <p style={{color: 'red'}}>{e.message}</p>);
            setErrors(errors);
        }


    }, [data])

    const handleClick = () => {

        if (!(contentProp && titleProp)) {
            return;
        }

        postUpdate({
            variables: {
                postId,
                title: titleProp,
                content: contentProp,
            }
        })

        handleClose();
        setContent("");
        setTitle("");
        setErrors([]);

    };

    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                Edit Post
            </Button>

            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Edit Post</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder=""
                                value={titleProp}
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
                                value={contentProp}
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
                        Edit
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
