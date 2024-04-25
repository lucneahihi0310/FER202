import { Col, NavLink } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link, Navigate } from 'react-router-dom';
import { FaSignInAlt, FaSignOutAlt, FaShoppingCart } from 'react-icons/fa';
import { useEffect, useState } from 'react';

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Kiểm tra trạng thái đăng nhập từ localStorage
    const userAccount = JSON.parse(localStorage.getItem('account'));
    if (userAccount) {
      setIsLoggedIn(true);
      setUser(userAccount);
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  }, []);
  const handleSignOut = () => {
    // Xóa thông tin đăng nhập khỏi localStorage
    localStorage.removeItem('account');

    // Cập nhật trạng thái đăng nhập và thông tin người dùng
    setIsLoggedIn(false);
    setUser(null);

    // Điều hướng về trang chính
    <Navigate to={"/"}/>
  };
  // Lấy giỏ hàng từ localStorage và tính tổng số lượng sản phẩm
  const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartItemCount = storedCart.reduce((total, item) => total + item.quantity, 0);

  return (
    <Navbar bg="dark" data-bs-theme="dark">
      <Container>
        <Navbar.Brand href="/">Navbar</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link as={Link} to={"/"}>Home</Nav.Link>
          <Nav.Link as={Link} to={"/products"}>Products</Nav.Link>
          <Nav.Link href="#pricing">Pricing</Nav.Link>
        </Nav>
        <Nav style={{ textAlign: "right" }}>
          {isLoggedIn && user ? (
            <Nav.Item style={{ marginRight: "10px", color: 'white' }}>
              Welcome, {user.name}
            </Nav.Item>
          ) : null}
          <Nav.Item style={{ marginRight: "10px" }}>
            <Link style={{ textDecoration: "none" }} to={"/cart"}><FaShoppingCart /> Cart ({cartItemCount})</Link>
          </Nav.Item>
          {isLoggedIn ? (
            <Nav.Item style={{ marginRight: "10px" }}>
               <Link style={{ textDecoration: "none" }} to={"#"} onClick={handleSignOut}><FaSignOutAlt />SignOut</Link>
            </Nav.Item>
          ) : (
            <Nav.Item style={{ marginRight: "10px" }}>
              <Link style={{ textDecoration: "none" }} to={"/auth/signin"}><FaSignInAlt />SignIn</Link>
            </Nav.Item>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
}

export default Header;
