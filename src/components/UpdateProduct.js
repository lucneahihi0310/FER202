import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function UpdateProduct({ categories }) {
    const [errors, setErrors] = useState({});
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [quantity, setQuantity] = useState(0);
    const [catId, setCatId] = useState(1);
    const [createAt, setCreateAt] = useState('');
    const [status, setStatus] = useState(false);
    const { pid } = useParams();
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        fetch("http://localhost:9999/products/" + pid)
            .then(res => res.json())
            .then(result => {
                setId(result.id);
                setName(result.name);
                setPrice(result.price);
                setQuantity(result.quantity);
                setCatId(result.catId);
                setCreateAt(result.createAt);
                setStatus(result.status);
            });
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        const editProduct = { id, name, price, quantity, catId, createAt, status };

        const form = event.currentTarget;
        const newErrors = {};

        // Kiểm tra ID và Name không được bỏ trống
        if (!form.elements.id.value.trim()) {
            newErrors.id = 'ID is required';
        } else if (!/^P\d{3}$/.test(form.elements.id.value)) {
            newErrors.id = 'ID must start with P and be followed by 3 digits';
        } else if (products.find(p => p.id == id)) {
            newErrors.id = 'ID already exists';
        }

        // Kiểm tra Name không được bỏ trống
        if (!form.elements.name.value.trim()) {
            newErrors.name = 'Name is required';
        }

        // Kiểm tra Price và Quantity không được nhỏ hơn hoặc bằng 0
        if (parseInt(form.elements.price.value) <= 0) {
            newErrors.price = 'Price must be greater than 0';
        }
        if (parseInt(form.elements.quantity.value) <= 0) {
            newErrors.quantity = 'Quantity must be greater than 0';
        }

        // Kiểm tra CreateAt không được chọn quá ngày hiện tại
        const selectedDate = new Date(form.elements.createAt.value);
        const currentDate = new Date();
        if (selectedDate > currentDate) {
            newErrors.createAt = 'CreateAt must be today or before';
        }

        setErrors(newErrors);

        // Nếu không có lỗi, có thể submit form
        if (Object.keys(newErrors).length === 0) {
            // Submit form logic here
            fetch("http://localhost:9999/products/"+id, {
                method: "PUT",
                body: JSON.stringify(editProduct),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            }).then(res => res.json()).then(result => {
                if (result) {
                    alert(`${name} update success.`);
                    navigate("/products");
                }
            })
        }
    };

    return (
        <Container>
            <Row>
                <Col xs={3}><Link style={{ textDecoration: 'none' }} to={'/products'}>Go Home</Link> </Col>
                <Col xs={9}><h1>Update Procuct</h1></Col>
            </Row>
            <Row>
                <Col>
                    <Form onSubmit={handleSubmit}>
                        <Row className="mb-3">
                            <Form.Group as={Col}>
                                <Form.Label style={{ color: "red" }}>*</Form.Label>
                                <Form.Label>ID</Form.Label>
                                <Form.Control type="text" placeholder="ID" name="id" onChange={e => setId(e.target.value)} value={id} disabled></Form.Control>
                                {errors.id && <Form.Text className="text-danger">{errors.id}</Form.Text>}
                            </Form.Group>

                            <Form.Group as={Col}>
                                <Form.Label style={{ color: "red" }}>*</Form.Label>
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="text" placeholder="Name" name="name" onChange={e => setName(e.target.value)} value={name} />
                                {errors.name && <Form.Text className="text-danger">{errors.name}</Form.Text>}
                            </Form.Group>
                        </Row>
                        <Row className="mb-3">
                            <Form.Group as={Col}>
                                <Form.Label>Price</Form.Label>
                                <Form.Control type="number" min={0} placeholder='Price' name="price" onChange={e => setPrice(parseInt(e.target.value))} value={price} />
                                {errors.price && <Form.Text className="text-danger">{errors.price}</Form.Text>}
                            </Form.Group>

                            <Form.Group as={Col}>
                                <Form.Label>Category</Form.Label>
                                <Form.Select value={catId} name="category" onChange={e => setCatId(parseInt(e.target.value))}>
                                    {
                                        categories?.map(c => (
                                            <option key={c.id} value={c.id} selected>{c.name}</option>
                                        ))
                                    }
                                </Form.Select>
                            </Form.Group>

                            <Form.Group as={Col}>
                                <Form.Label>Quantity</Form.Label>
                                <Form.Control type='number' min={0} placeholder='Quantity' name="quantity" onChange={e => setQuantity(parseInt(e.target.value))} value={quantity} />
                                {errors.quantity && <Form.Text className="text-danger">{errors.quantity}</Form.Text>}
                            </Form.Group>
                        </Row>
                        <Row className="mb-3">
                            <Form.Group as={Col}>
                                <Form.Label>CreateAt</Form.Label>
                                <Form.Control type="date" name="createAt" onChange={e => setCreateAt(e.target.value)} value={createAt} />
                                {errors.createAt && <Form.Text className="text-danger">{errors.createAt}</Form.Text>}
                            </Form.Group>

                            <Form.Group as={Col}>
                                <Form.Label as="legend" column sm={2}>
                                    Status
                                </Form.Label>
                                {
                                    status?
                                        <Form.Check onChange={e => setStatus(e.target.checked)} checked={status} />
                                        :
                                        <Form.Check onChange={e => setStatus(e.target.checked)} />
                                }
                            </Form.Group>
                        </Row>
                        <Button variant="primary" type="submit">
                            Save
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}