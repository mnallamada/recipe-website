import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaLinkedin } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-dark text-light py-4">
            <Container>
                <Row>
                    <Col md={6} className="mb-3">
                        <h5>About Mounika's Kitchen</h5>
                        <p className="small">
                            Welcome to <strong>Mounika's Kitchen</strong>, where Mounika shares her favorite recipes and cooking tips. From traditional flavors to innovative creations, every recipe is crafted with love and care to bring joy to your meals.
                        </p>
                    </Col>
                    <Col md={3} className="mb-3">
                        <h5>Explore</h5>
                        <ul className="list-unstyled small">
                            <li><a href="https://mnallamada.github.io/portfolio" target='_blank' rel="noopener noreferrer" className="text-decoration-none text-light">About Mounika</a></li>
                        </ul>
                    </Col>
                    <Col md={3} className="mb-3">
                        <h5>Stay Connected</h5>
                        <div className="d-flex">
                            <a href="https://linkedin.com/in/mounikanallamada" target="_blank" rel="noopener noreferrer" className="text-light">
                                <FaLinkedin size={24} />
                            </a>
                        </div>
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col className="text-center">
                        <p className="small mb-0">&copy; {new Date().getFullYear()} Mounika's Kitchen. All Rights Reserved.</p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;
