import { useEffect, useState } from "react";
import { Col, Container, Row, Image, Button } from "react-bootstrap";
import { useParams } from "react-router-dom";

export default function ProductDetail(){
    const {id} = useParams();
    const [product, setProduct] = useState({});
    const [selectedImage, setSelectedImage] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);
    const images = ["/assets/images/dieuhoadaikin.jpg", "/assets/images/tulanh1.jpg", "/assets/images/tulanhLG.jpg", "/assets/images/tulanhpana.jpg"];

    useEffect(()=>{
        fetch(`http://localhost:9999/products/${id}`)
        .then(res => res.json())
        .then(result => setProduct(result));
    },[]);

    const handleImageClick = (index) => {
        setSelectedImage(images[index]);
        setCurrentIndex(index);
    };

    const handlePrev = () => {
        const prevIndex = (currentIndex - 1 + images.length) % images.length;
        setSelectedImage(images[prevIndex]);
        setCurrentIndex(prevIndex);
    };

    const handleNext = () => {
        const nextIndex = (currentIndex + 1) % images.length;
        setSelectedImage(images[nextIndex]);
        setCurrentIndex(nextIndex);
    };

    return(
        <Container fluid>
            <Row>
                <Col style={{textAlign:"center", position: "relative"}}>
                    <Image style={{height:"400px", width:"400px", marginBottom:"10px"}} src={selectedImage || images[currentIndex]} fluid />
                    <Button variant="light" style={{position: "absolute", top: "50%", left: "10px"}} onClick={handlePrev}>&lt;</Button>{' '}
                    <Button variant="light" style={{position: "absolute", top: "50%", right: "10px"}} onClick={handleNext}>&gt;</Button>
                    <Row>
                        {images.map((image, index) => (
                            <Col key={index}>
                                <Image src={image} onClick={() => handleImageClick(index)} fluid />
                            </Col>
                        ))}
                    </Row>
                </Col>
                <Col>
                    <Col>
                        <div>Product ID: {product?.id}</div>
                        <div>Name: {product?.name}</div>
                        <div>Price: {product?.price}</div>
                        <div>Quantity: {product?.quantity}</div>
                        <div>Status: {product?.status ? 'In Stock' : 'Out Stock'}</div>
                    </Col>
                </Col>
            </Row>
        </Container>
    );
}
