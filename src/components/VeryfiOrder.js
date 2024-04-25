import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function VerifyOrder() {
    const currentDate = new Date().toISOString().split('T')[0];
    const [orderData, setOrderData] = useState({
        orderDate: currentDate,
        requireDate: '',
        customer: {
            cusId: '',
            fName: '',
            lName: '',
            address: '',
            mobile: '',
            email: ''
        },
        products: JSON.parse(localStorage.getItem('cart')) || []
    });

    const [totalAmount, setTotalAmount] = useState(0);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        // Tính tổng số tiền của đơn hàng
        const subtotal = orderData.products.reduce((acc, product) => {
            const productPrice = product.price * product.quantity;
            const productVAT = productPrice * 0.08;
            const productDiscount = productPrice * 0.1;
            return acc + productPrice + productVAT - productDiscount;
        }, 0);
        setTotalAmount(subtotal);
    }, [orderData.products]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setOrderData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleCustomerChange = (e) => {
        const { name, value } = e.target;
        setOrderData(prevState => ({
            ...prevState,
            customer: {
                ...prevState.customer,
                [name]: value
            }
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            console.log(orderData);
            // Gửi dữ liệu đến API hoặc cơ sở dữ liệu của bạn
            // Reset form
            setOrderData({
                orderDate: currentDate,
                requireDate: '',
                customer: {
                    cusId: '',
                    fName: '',
                    lName: '',
                    address: '',
                    mobile: '',
                    email: ''
                },
                products: []
            });
            setErrors({});
        }
    };

    const validateForm = () => {
        let valid = true;
        const newErrors = {};

        if (!orderData.requireDate) {
            newErrors.requireDate = 'Require Date is required.';
            valid = false;
        }

        if (!orderData.customer.fName) {
            newErrors.fName = 'First Name is required.';
            valid = false;
        }

        if (!orderData.customer.lName) {
            newErrors.lName = 'Last Name is required.';
            valid = false;
        }

        if (!orderData.customer.address) {
            newErrors.address = 'Address is required.';
            valid = false;
        }

        if (!orderData.customer.mobile) {
            newErrors.mobile = 'Mobile is required.';
            valid = false;
        }

        if (!orderData.customer.email) {
            newErrors.email = 'Email is required.';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleCheckout = () => {
        if (validateForm()) {
            // Tạo form để gửi yêu cầu đến VNPay Sandbox
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';

            const params = {
                vnp_Amount: totalAmount * 100,
                vnp_Command: 'pay',
                vnp_CreateDate: new Date().toISOString().replace(/[-:.TZ]/g, ''),
                vnp_CurrCode: 'VND',
                vnp_IpAddr: '127.0.0.1',
                vnp_Locale: 'vn',
                vnp_OrderInfo: 'Thanh toan don hang',
                vnp_OrderType: 'billpayment',
                vnp_ReturnUrl: 'URL_RETURN',
                vnp_TmnCode: 'YOUR_TMNCODE',
                vnp_TxnRef: new Date().getTime().toString(),
            };

            for (const key in params) {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = params[key];
                form.appendChild(input);
            }

            document.body.appendChild(form);
            form.submit();
        }
    };

    return (
        <Container>
            <Row>
                <Col><Link style={{ textDecoration: "none" }} to={"/cart"}>Back To Cart</Link></Col>
            </Row>
            <h2 style={{ textAlign: "center" }}>Verify Order</h2>
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col>
                        <Form.Group controlId="orderDate">
                            <Form.Label>Order Date</Form.Label>
                            <Form.Control
                                type="date"
                                name="orderDate"
                                value={orderData.orderDate}
                                onChange={handleChange}
                                disabled
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="requireDate">
                            <Form.Label>Require Date</Form.Label>
                            <Form.Control
                                type="date"
                                name="requireDate"
                                value={orderData.requireDate}
                                onChange={handleChange}
                            />
                            {errors.requireDate && <div className="text-danger">{errors.requireDate}</div>}
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Group controlId="fName">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="fName"
                                value={orderData.customer.fName}
                                onChange={handleCustomerChange}
                            />
                            {errors.fName && <div className="text-danger">{errors.fName}</div>}
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="lName">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="lName"
                                value={orderData.customer.lName}
                                onChange={handleCustomerChange}
                            />
                            {errors.lName && <div className="text-danger">{errors.lName}</div>}
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Group controlId="address">
                            <Form.Label>Address</Form.Label>
                            <Form.Control
                                type="text"
                                name="address"
                                value={orderData.customer.address}
                                onChange={handleCustomerChange}
                            />
                            {errors.address && <div className="text-danger">{errors.address}</div>}
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="mobile">
                            <Form.Label>Mobile</Form.Label>
                            <Form.Control
                                type="text"
                                name="mobile"
                                value={orderData.customer.mobile}
                                onChange={handleCustomerChange}
                            />
                            {errors.mobile && <div className="text-danger">{errors.mobile}</div>}
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Group controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={orderData.customer.email}
                                onChange={handleCustomerChange}
                            />
                            {errors.email && <div className="text-danger">{errors.email}</div>}
                        </Form.Group>
                    </Col>
                </Row>
                <Row style={{ marginTop: "20px" }}>
                    <Col>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Product ID</th>
                                    <th>Product Name</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>VAT</th>
                                    <th>Discount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orderData.products.map((product, index) => (
                                    <tr key={index}>
                                        <td>{product.id}</td>
                                        <td>{product.name}</td>
                                        <td>{product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
                                        <td>{product.quantity}</td>
                                        <td>{(product.price * product.quantity * 0.08).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
                                        <td>{(product.price * product.quantity * 0.1).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <div style={{ textAlign: "center" }}>
                            <h5>Total Amount:</h5>
                            <h2>{totalAmount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</h2>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Button variant="primary" onClick={handleCheckout}>
                            Checkout
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Container>
    );
}

export default VerifyOrder;
