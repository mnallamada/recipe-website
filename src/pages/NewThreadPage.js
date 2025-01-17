import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { auth } from '../firebase/config'; // Import Firebase auth to get user ID
import AppNavbar from '../components/Navbar';

const NewThreadPage = () => {
const [title, setTitle] = useState('');
const [content, setContent] = useState('');
const [category, setCategory] = useState('');
const [categories, setCategories] = useState([]); // For populating dropdown
const [tags, setTags] = useState('');
const navigate = useNavigate();
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

const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const user = auth.currentUser;
        if (!user) {
            alert('You must be logged in to create a thread.');
            return;
        }

        const payload = {
            title,
            content,
            tags: tags.split(',').map(tag => tag.trim()), // Convert tags to array
            category,
            userId: user.uid, // Pass the user ID from Firebase auth
        };

        await axios.post('http://localhost:8080/threads/create', payload);
        alert('Thread created successfully!');
        navigate('/forum');
    } catch (error) {
        console.error('Error creating thread:', error);
        alert('Failed to create thread. Please try again.');
    }
};

return (
    <>
        <AppNavbar />
        <Container className="mt-4">
            <h1>Start a New Thread</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter thread title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Content</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Enter thread content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Category</Form.Label>
                    <Form.Select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    >
                        <option value="">Select a category</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.name}>
                                {cat.name}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Tags (comma-separated)</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter tags (e.g., recipe, cooking)"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                    />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Create Thread
                </Button>
            </Form>
        </Container>
    </>
);
};

export default NewThreadPage;