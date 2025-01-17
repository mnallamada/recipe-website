import React, { useEffect, useState } from 'react';
import { Card, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AppNavbar from '../components/Navbar';

const CategoriesPage = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:8080/categories');
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    return (
        <>
            <AppNavbar />
            <Container className="mt-4">
                <h1>Community Forum</h1>
                <Row>
                    {categories.map(category => (
                        <Col key={category.id} md={4} className="mb-4">
                            <Card>
                                <Card.Body>
                                    <Card.Title>{category.name}</Card.Title>
                                    <Card.Text>Threads: {category.threadCount}</Card.Text>
                                    <Link to={`/forum/${category.id}`} className="btn btn-primary">
                                        View Category
                                    </Link>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        </>
        
    );
};

export default CategoriesPage;
