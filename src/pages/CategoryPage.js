import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Container, Card } from 'react-bootstrap';
import AppNavbar from '../components/Navbar';
const CategoryPage = () => {
    const { categoryId } = useParams();
    const [threads, setThreads] = useState([]);

    useEffect(() => {
        const fetchThreads = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/threads/category/${categoryId}`);
                setThreads(response.data);
            } catch (error) {
                console.error('Error fetching threads:', error);
            }
        };

        fetchThreads();
    }, [categoryId]);

    return (
        <>
            <AppNavbar />
            <Container className="mt-4">
                <h1>Threads in Category</h1>
                {threads.map(thread => (
                    <Card key={thread.threadId} className="mb-4">
                        <Card.Body>
                            <Card.Title>{thread.title}</Card.Title>
                            <Card.Text>{thread.description}</Card.Text>
                            <Link to={`/forum/thread/${thread.threadId}`} className="btn btn-primary">
                                View Thread
                            </Link>
                        </Card.Body>
                        <Card.Footer>
                            <small>Views: {thread.viewCount} | Likes: {thread.likesCount} | Comments: {thread.commentsCount}</small>
                        </Card.Footer>
                    </Card>
                ))}
            </Container>
        </>
    );
};

export default CategoryPage;
