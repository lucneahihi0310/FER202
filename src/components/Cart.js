import { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Cart() {
    const [cartItems, setCartItems] = useState(JSON.parse(localStorage.getItem('cart')) || []);

    const totalAmount = cartItems.reduce((total, item) => {
        return total + (item.price * item.quantity * 0.08 + (item.price * item.quantity));
    }, 0);

    const formatCurrency = (amount) => {
        return amount.toLocaleString('vi-VN', { style: 'decimal', minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' đ';
    };
    const handleRemoveItem = (id) => {
        const updatedCart = cartItems.filter(item => item.id !== id);
        updateCart(updatedCart);
    };
    const handleClearCart = () => {
        localStorage.removeItem('cart');
        setCartItems([]);
    };

    const handleIncreaseQuantity = (id) => {
        const updatedCart = cartItems.map(item =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        );
        updateCart(updatedCart);
    };

    const handleDecreaseQuantity = (id) => {
        const updatedCart = cartItems.map(item =>
            item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
        );
        updateCart(updatedCart);
    };

    const updateCart = (updatedCart) => {
        setCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    return (
        <Container fluid>
            <Row>
                <Col>
                <Link style={{textDecoration:"none"}} to={"/"}>Back To ProductList</Link>
                </Col>
            </Row>
            <Row>
                <Col style={{ display: "flex", justifyContent: "right" }}>
                    <Button style={{ marginBottom: "10px" }} onClick={handleClearCart}>Clear Cart</Button>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Product Name</th>
                                <th>Price</th>
                                <th>Image</th>
                                <th>Quantity</th>
                                <th>Total</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                cartItems.map(item => (
                                    <tr key={item.id}>
                                        <td>{item.id}</td>
                                        <td>{item.name}</td>
                                        <td>{formatCurrency(item.price)}</td>
                                        <td style={{ textAlign: "center" }}><img src={`assets/images/${item.image}`} alt={item.name} style={{ width: '100px', height: '100px' }} /></td>
                                        <td style={{textAlign:"center"}}>
                                            <Button variant="outline-primary" size="sm" onClick={() => handleDecreaseQuantity(item.id)}>-</Button>
                                            {' '}{item.quantity}{' '}
                                            <Button variant="outline-primary" size="sm" onClick={() => handleIncreaseQuantity(item.id)}>+</Button>
                                        </td>
                                        <td>{formatCurrency(item.price * item.quantity)}</td>
                                        <td><Button variant="outline-danger" size="sm" onClick={() => handleRemoveItem(item.id)}>Remove</Button></td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </Table>
                </Col>
            </Row>
            <Row>
                <Col>
                    <div style={{ textAlign: "center" }}>
                        <h5>VAT: 8%</h5>
                        <h2>Total: {formatCurrency(totalAmount)}</h2>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Link className='btn btn-primary' style={{ textDecoration: "none" }} to={"/cart/verify"}>Verify Order</Link>
                </Col>
            </Row>
        </Container>
    );
}

export default Cart;
