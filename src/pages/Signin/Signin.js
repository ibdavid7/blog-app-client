import React, {useState, useEffect} from "react";

import {Form} from "react-bootstrap";
import Button from "@restart/ui/esm/Button";
import {gql, useMutation} from "@apollo/client";

const SIGNIN = gql`
    mutation login($signinCredentials: CredentialsInput!) {
        signin(credentials: $signinCredentials) {
            userErrors {
                message
            }
            token
        }
    }
`;
export default function Signin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [signin, {loading, data}] = useMutation(SIGNIN);
    console.log(data);

    useEffect(() => {
        if (data?.signin?.userErrors?.length) {

            const errors = data.signin.userErrors.map(e => <p style={{color:'red'}}>{e.message}</p>);

            setError(errors);
        }

        if (data?.signin?.token) {
            localStorage.setItem("token", data.signin.token);
        }
    }, [data])


    const handleClick = () => {

        const signinCredentials = {
            email,
            password,
        }

        signin({
            variables: {
                signinCredentials,
            }
        });

        setEmail("");
        setPassword("");
        setError("");

    };


    return (
        <div>
            <Form>
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

                {error && <div>{error}</div>}
                <Button onClick={handleClick}>Signin</Button>
            </Form>
        </div>
    );
}
