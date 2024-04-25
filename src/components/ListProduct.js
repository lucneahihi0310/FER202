import { useEffect, useState } from 'react';
import { Table, Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function ListProduct() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [cartItems, setCartItems] = useState(JSON.parse(localStorage.getItem('cart')) || []);

    const addToCart = (product) => {
        const existingProduct = cartItems.find(item => item.id === product.id);

        if (existingProduct) {
            const updatedCart = cartItems.map(item =>
                item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            );
            setCartItems(updatedCart);
        } else {
            setCartItems([...cartItems, {
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            }]);
        }

        localStorage.setItem('cart', JSON.stringify(cartItems));

        // Gửi dữ liệu lên server nếu có người dùng đăng nhập
        const userAccount = JSON.parse(localStorage.getItem('account'));
        // if (userAccount) {
        //     fetch('http://localhost:9999/carts', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify({
        //             id: product.id,
        //             quantity: existingProduct ? existingProduct.quantity + 1 : 1
        //         }),
        //     });
        // }
    };

    const formatCurrency = (amount) => {
        return amount.toLocaleString('vi-VN', { style: 'decimal', minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' đ';
    };

    useEffect(() => {
        fetch(`http://localhost:9999/products`)
            .then(res => res.json())
            .then(result => setProducts(result));
        fetch(`http://localhost:9999/categories`)
            .then(res => res.json())
            .then(result => setCategories(result));
    }, []);

    return ((
        <Container fluid>
            <Row>
                {/* <Col xs={2} sm={2}>
                    <ul>
                        {
                            categories?.map(c => (
                                <li key={c.id}>
                                    <Link style={{ textDecoration: "none" }}>{c.name}</Link>
                                </li>
                            ))
                        }
                    </ul>
                </Col> */}
                <Col xs={12} sm={12}>
                    <Row>
                        {
                            products.map(p => (
                                <Col key={p.id} xxl={3} xl={3} md={6} sm={12} xs={12} style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
                                    <Card key={p.id} style={{ width: '18rem', margin: "10px" }}>
                                        <div style={{ textAlign: "center" }}>
                                            <Card.Img style={{ width: "200px", height: "200px", marginTop: "10px" }} variant="top" src={`assets/images/${p.image}`} />
                                        </div>
                                        <Card.Body>
                                            <Card.Title>
                                                <Link style={{ textDecoration: 'none', color: "black" }} to={`/product/${p.id}`}>{p.name}</Link>
                                            </Card.Title>
                                            <Card.Text style={{ color: '#ee4d2d' }}>{formatCurrency(p.price)}</Card.Text>
                                            <Button onClick={() => addToCart(p)}>Add To Cart</Button>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))
                        }
                    </Row>

                </Col>
            </Row>
            <Row>
                <Col style={{ justifyContent: 'center', display: 'flex' }}>
                    <Button style={{ margin: "5px" }}>previos </Button>
                    <Button variant="secondary" style={{ margin: "5px" }}>1 </Button>
                    <Button variant="secondary" style={{ margin: "5px" }}>2 </Button>
                    <Button variant="secondary" style={{ margin: "5px" }}>3 </Button>
                    <Button variant="secondary" style={{ margin: "5px" }}>4 </Button>
                    <Button variant="secondary" style={{ margin: "5px" }}>5 </Button>
                    <Button variant="secondary" style={{ margin: "5px" }}>6 </Button>
                    <Button style={{ margin: "5px" }}>next</Button>
                </Col>
            </Row>
        </Container>
    ));
}
export default ListProduct;