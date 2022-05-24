import Button from "@restart/ui/esm/Button";
import React, {useEffect, useState} from "react";
import {Form} from "react-bootstrap";
import {gql, useMutation} from "@apollo/client";

const CREATEUSER = gql`
    mutation createUser($email:String!, $password: String!, $name: String!, $bio: String!) {
        userCreate(credentials: {email: $email, password: $password}, name: $name, bio: $bio) {
            userErrors {
                message
            }
            token
        }
    }
`;

export default function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [createUser, {data, loading}] = useMutation(CREATEUSER);

    // console.log(data);

    useEffect(() => {

        if (data?.userCreate?.userErrors?.length) {
            const errors = data.userCreate.userErrors.map(e => <p style={{color: 'red'}}>{e.message}</p>);
            setError(errors);
        }

        if (data?.userCreate?.token) {
            localStorage.setItem("token", data.userCreate.token);
        }
    }, [data])

    const handleClick = () => {

        createUser({
            variables: {
                email,
                password,
                bio,
                name,
            }
        })

        setEmail("");
        setPassword("");
        setError("");

    };

    const [error, setError] = useState(null);

    return (
        <div>
            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder=""
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder=""
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder=""
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Bio</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                    />
                </Form.Group>
                {error && <div>{error}</div>}
                <Button onClick={handleClick}>Signup</Button>
            </Form>
        </div>
    );
}
