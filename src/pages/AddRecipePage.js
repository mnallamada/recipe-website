import React, { useState } from 'react';
import { db, storage } from '../firebase/config';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Container, Form, Button } from 'react-bootstrap';
import AppNavbar from '../components/Navbar';

const AddRecipePage = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [videoUrl, setVideoUrl] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [steps, setSteps] = useState('');
    const [uploading, setUploading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!imageFile) {
            alert('Please upload an image.');
            return;
        }

        setUploading(true);
        try {
            // Upload image to Firebase Storage
            const storageRef = ref(storage, `recipes/${imageFile.name}`);
            const uploadTask = uploadBytesResumable(storageRef, imageFile);

            // Wait for upload completion and get download URL
            const imageUrl = await new Promise((resolve, reject) => {
                uploadTask.on(
                    'state_changed',
                    null,
                    (error) => reject(error),
                    async () => {
                        const url = await getDownloadURL(storageRef);
                        resolve(url);
                    }
                );
            });

            // Prepare recipe data
            const newRecipe = {
                title,
                description,
                imageUrl,
                videoUrl,
                ingredients: ingredients.split('\n'),
                steps: steps.split('\n'),
            };

            // Add recipe to Firestore
            await addDoc(collection(db, 'recipes'), newRecipe);
            alert('Recipe added successfully!');

            // Reset form fields
            setTitle('');
            setDescription('');
            setImageFile(null);
            setVideoUrl('');
            setIngredients('');
            setSteps('');
        } catch (error) {
            console.error('Error adding recipe:', error);
            alert('Failed to add recipe. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleFileChange = (e) => {
        setImageFile(e.target.files[0]);
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
                        <Form.Label>Image</Form.Label>
                        <Form.Control type="file" onChange={handleFileChange} required />
                        {imageFile && (
                            <div className="mt-3">
                                <p>Selected file: {imageFile.name}</p>
                            </div>
                        )}
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Video URL</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter YouTube video URL"
                            value={videoUrl}
                            onChange={(e) => setVideoUrl(e.target.value)}
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
                    <Button variant="primary" type="submit" disabled={uploading}>
                        {uploading ? 'Uploading...' : 'Add Recipe'}
                    </Button>
                </Form>
            </Container>
        </>
    );
};

export default AddRecipePage;
