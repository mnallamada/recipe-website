import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Card, Form, Button } from 'react-bootstrap';
import AppNavbar from '../components/Navbar';
const ThreadPage = () => {
    const { threadId } = useParams();
    const [thread, setThread] = useState(null);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        const fetchThread = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/threads/${threadId}`);
                setThread(response.data);
            } catch (error) {
                console.error('Error fetching thread:', error);
            }
        };

        fetchThread();
    }, [threadId]);

    const handleAddComment = async () => {
        if (!newComment.trim()) return;
        try {
            await axios.post(`http://localhost:8080/threads/${threadId}/add-comment`, {
                content: newComment,
            });
            setNewComment('');
            // Refresh comments after adding
            const response = await axios.get(`http://localhost:8080/threads/${threadId}`);
            setThread(response.data);
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    if (!thread) return <p>Loading...</p>;

    return (
        <>
            <AppNavbar />
            <Container className="mt-4">
                <Card className="mb-4">
                    <Card.Body>
                        <Card.Title>{thread.title}</Card.Title>
                        <Card.Text>{thread.description}</Card.Text>
                    </Card.Body>
                    <Card.Footer>
                        <small>Views: {thread.viewCount} | Likes: {thread.likesCount} | Comments: {thread.commentsCount}</small>
                    </Card.Footer>
                </Card>

                <h3>Comments</h3>
                {thread.comments.map((comment, index) => (
                    <Card key={index} className="mb-2">
                        <Card.Body>{comment.content}</Card.Body>
                        <Card.Footer>
                            <small>{new Date(comment.createdAt).toLocaleString()}</small>
                        </Card.Footer>
                    </Card>
                ))}

                <Form className="mt-4">
                    <Form.Group>
                        <Form.Label>Add a Comment</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Write your comment here..."
                            value={newComment}
                            onChange={e => setNewComment(e.target.value)}
                        />
                    </Form.Group>
                    <Button variant="primary" className="mt-2" onClick={handleAddComment}>
                        Post Comment
                    </Button>
                </Form>
            </Container>
        </>
    );
};

export default ThreadPage;
