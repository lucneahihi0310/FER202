// sử dụng function => tạo 1 component đặt tên là Products
import { Table, Container, Row, Col, Form } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FaSyncAlt, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
function Product() {
    // tạo ra các biến trạng thái (state) để quản lý dữ liệu của component
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [catId, setCatId] = useState(0);
    const [search, setSearch] = useState("");
    const { cat_id } = useParams();
    const navigate = useNavigate();
    useEffect(() => {
        fetch(cat_id ? `http://localhost:9999/products/?catId=${cat_id}` : "http://localhost:9999/products")
            .then(res => res.json())
            .then(result => {
                let searResult = [];
                if (catId === 0) {
                    searResult = result.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
                    setProducts(searResult);
                } else {
                    searResult = result.filter(p => p.catId === catId && p.name.toLowerCase().includes(search.toLowerCase()));
                    setProducts(searResult);
                }
            });

        fetch("http://localhost:9999/categories")
            .then(res => res.json())
            .then(result => setCategories(result));
    }, [catId, search, cat_id]);
    // Hàm để xóa sản phẩm
    function handleDelete(id){
        if(products.find((p)=>p.id == id)){
            if(window.confirm("do you want delete.")){
                fetch("http://localhost:9999/products/"+id,{
                method: "DELETE"
            });
            fetch("http://localhost:9999/products")
            .then(res => res.json())
            .then(data => setProducts(data));
            }
        }
    };
    return (
        <Container fluid>
            <Row>
                <Col xs={6}>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Control type="text" placeholder="enter product name" style={{ border: "1px solid red" }}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Col>
                <Col xs={3}>
                    <Form.Select onChange={(e) => setCatId(parseInt(e.target.value))}>
                        <option key={0} value={0}>Select all</option>
                        {
                            categories?.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))
                        }
                    </Form.Select>
                </Col>
                <Col xs={3} style={{ textAlign: "center" }}>
                    <Link style={{ textDecoration: 'none' }} to={'/product/create'}><FaPlus /></Link>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Category</th>
                                <th>Action</th>
                            </tr>

                        </thead>
                        <tbody>
                            {
                                products.map(p => (
                                    <tr key={p.id}>
                                        <td>{p.id}</td>
                                        <td><Link style={{ textDecoration: 'none' }} to={`/product/${p.id}`}>{p.name}</Link></td>
                                        <td>{p.price}</td>
                                        <td>{p.quantity}</td>
                                        <td>{
                                            categories && categories.find(c => c.id === p.catId)?.name
                                        }</td>
                                        <td>
                                            <Link style={{ textDecoration: 'none', marginRight:"10px" }} to={`/product/edit/${p.id}`}><FaEdit /></Link>
                                            <Link to={"#"} style={{ textDecoration: 'none', color:"red"}} onClick={() => handleDelete(p.id)}><FaTrash /></Link>
                                        </td>
                                    </tr>
                                ))
                            }

                        </tbody>

                    </Table>
                </Col>
            </Row>
        </Container>

    );
}
function Category({ data }) {
    return (
        <ul>
            {
                data?.map(c => (
                    <li key={c.id}>
                        <Link style={{ textDecoration: 'none' }} to={`/products/category/${c.id}`}>{c.name}</Link>
                    </li>

                ))
            }

        </ul>
    );
}
export { Product, Category };