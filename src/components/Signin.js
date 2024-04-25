import { useEffect, useState } from "react";
import { Col, Container, Row, Form, Button } from "react-bootstrap";
import { json, useNavigate } from "react-router-dom";

export default function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
        //check localstorage
        if (localStorage.getItem('remember')) {
            const account = JSON.parse(localStorage.getItem('remember'));
            setEmail(account?.email);
            setPassword(account?.password);
        }
    }, []);
    function handleSignIn(e) {
        e.preventDefault();
        fetch(`http://localhost:9999/users/?email=${email}&password=${password}`)
            .then(res => res.json())
            .then((data) => {
                if (data.length > 0) {
                    const existUser = data[0];
                    //add this user into localstorage
                    localStorage.setItem("account", JSON.stringify({ id: existUser.id, email: existUser.email, role: existUser.role, name: existUser.name }));
                    //set check remember
                    if (document.getElementById('remember').checked == true) {
                        localStorage.setItem('remember', JSON.stringify({ email: email, password: password }))
                    }
                    alert("Login succses")
                    navigate('/')
                }
            })
    }

    return (
        <Container>
            <Row>
                <Col>
                    <Form onSubmit={(e) => handleSignIn(e)} style={{ width: "60%", margin: "20px auto" }}>
                        <Form.Group className="mb-3">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="name@gmail.com" onChange={e => setEmail(e.target.value)} value={email} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Example textarea</Form.Label>
                            <Form.Control type="password" placeholder="password" onChange={e => setPassword(e.target.value)} value={password} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Check type="checkbox" label="Remember" id="remember" />
                        </Form.Group>
                        <Button variant="primary" type="submit">Login</Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}