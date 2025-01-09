import React, { useState } from 'react';
import { db } from '../firebase/config';
import { collection, addDoc } from 'firebase/firestore';
import { Container, Form, Button } from 'react-bootstrap';
import AppNavbar from '../components/Navbar';

const AddRecipePage = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [steps, setSteps] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newRecipe = {
            title,
            description,
            image,
            videoUrl,
            ingredients: ingredients.split('\n'),
            steps: steps.split('\n'),
        };

        try {
            await addDoc(collection(db, 'recipes'), newRecipe);
            alert('Recipe added successfully!');
            setTitle('');
            setDescription('');
            setImage('');
            setVideoUrl('');
            setIngredients('');
            setSteps('');
        } catch (error) {
            console.error('Error adding recipe:', error);
        }
    };

    return (
        <>
            <AppNavbar />
            <Container className="mt-4">
                <h1>Add a New Recipe</h1>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Recipe Title</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter recipe title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Enter recipe description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Image URL</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter image URL"
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Video URL</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter YouTube video URL"
                            value={videoUrl}
                            onChange={(e) => setVideoUrl(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Ingredients (one per line)</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Enter ingredients"
                            value={ingredients}
                            onChange={(e) => setIngredients(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Steps (one per line)</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Enter steps"
                            value={steps}
                            onChange={(e) => setSteps(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Add Recipe
                    </Button>
                </Form>
            </Container>
        </>
    );
};

export default AddRecipePage;