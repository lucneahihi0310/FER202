import { Product, Category } from "./components/Product";
import Header from "./components/Header";
import { Container, Row, Col } from "react-bootstrap";
import CreateProduct from "./components/CreateProduct";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import ProductDetail from "./components/ProductDetail";
import UpdateProduct from "./components/UpdateProduct";
import Index from "./components/Index";
import SignIn from "./components/Signin";
import Cart from "./components/Cart";
import ListProduct from "./components/ListProduct";
import VeryfiOrder from "./components/VeryfiOrder";

function App() {
  const ProtectedRoute = ({ children, allowedRoles }) => {
    const userAccount = JSON.parse(localStorage.getItem('account'));
    if (!userAccount) {
      return <Navigate to="/auth/signin" />;
    }

    if (allowedRoles && !allowedRoles.includes(userAccount.role)) {
      return <Navigate to="/" />;
    }

    return children;
  };
  const [categories, SetCategories] = useState([]);
  useEffect(() => {
    fetch("http://localhost:9999/categories")
      .then(res => res.json())
      .then(result => SetCategories(result));
  }, []);
  return (
    <BrowserRouter>
      <Container>
        <Row>
          <Col style={{ textAlign: "center", lineHeight: "50px", marginBottom: "20px" }}><Header /></Col>
        </Row>
        <Row>
          <Col xs={2} sm={2} md={2}><Category data={categories} /></Col>
          <Col xs={10} sm={10} md={10}>

            <Routes>
              <Route path="/" element={<ListProduct />} />
              <Route path="/products" element={<ProtectedRoute allowedRoles={['admin']}><Product /></ProtectedRoute>} />
              <Route path="/product/create" element={<ProtectedRoute allowedRoles={['admin']}><CreateProduct categories={categories} /></ProtectedRoute>} />
              <Route path="/products/category/:cat_id" element={<ProtectedRoute allowedRoles={['admin']}><Product /></ProtectedRoute>} />
              <Route path="/product/:id" element={<ProtectedRoute allowedRoles={['user']}><ProductDetail /></ProtectedRoute>} />
              <Route path="/product/edit/:pid" element={<ProtectedRoute allowedRoles={['admin']}><UpdateProduct categories={categories} /></ProtectedRoute>} />
              <Route path="/cart" element={<ProtectedRoute allowedRoles={['user']}><Cart /></ProtectedRoute>} />
              <Route path="/auth/signin" element={<SignIn />} />
              <Route path="/cart/verify" element={<ProtectedRoute allowedRoles={['user']}><VeryfiOrder/></ProtectedRoute>}/>
            </Routes>
          </Col>
        </Row>
        <Row>
          <Col style={{ textAlign: "center", lineHeight: "50px", marginTop: "20px", background: "black" }}>Footer</Col>
        </Row>
      </Container>
    </BrowserRouter>
  );
}

export default App;
