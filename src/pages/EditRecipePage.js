import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, storage } from '../firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap';

const EditRecipe = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState({
        title: '',
        description: '',
        ingredients: '',
        steps: '',
        videoUrl: '',
        imageUrl: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const docRef = doc(db, 'recipes', id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setRecipe(docSnap.data());
                } else {
                    setError('Recipe not found');
                }
            } catch (error) {
                setError('Failed to load recipe');
            } finally {
                setLoading(false);
            }
        };

        fetchRecipe();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRecipe((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setUploading(true);
            let uploadedImageUrl = recipe.imageUrl;

            // Upload image if a new file is selected
            if (imageFile) {
                const storageRef = ref(storage, `recipes/${id}/${imageFile.name}`);
                const uploadTask = uploadBytesResumable(storageRef, imageFile);

                // Wait for upload completion and get download URL
                await new Promise((resolve, reject) => {
                    uploadTask.on(
                        'state_changed',
                        null,
                        (error) => reject(error),
                        () => resolve()
                    );
                });

                uploadedImageUrl = await getDownloadURL(storageRef);
            }

            // Update Firestore document
            const docRef = doc(db, 'recipes', id);
            await updateDoc(docRef, { ...recipe, imageUrl: uploadedImageUrl });
            alert('Recipe updated successfully!');
            navigate(`/recipe/${id}`);
        } catch (error) {
            console.error('Error updating recipe:', error);
            alert('Failed to update recipe. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    if (loading) return <Spinner animation="border" />;
    if (error) return <Alert variant="danger">{error}</Alert>;

    return (
        <Container className="mt-5">
            <h2>Edit Recipe</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                        type="text"
                        name="title"
                        value={recipe.title}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        name="description"
                        value={recipe.description}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Ingredients</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={5}
                        name="ingredients"
                        value={recipe.ingredients}
                        onChange={handleChange}
                        placeholder="Enter ingredients as HTML (e.g., <ul><li>Item 1</li><li>Item 2</li></ul>)"
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Steps</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={5}
                        name="steps"
                        value={recipe.steps}
                        onChange={handleChange}
                        placeholder="Enter steps as HTML (e.g., <ol><li>Step 1</li><li>Step 2</li></ol>)"
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Video URL</Form.Label>
                    <Form.Control
                        type="text"
                        name="videoUrl"
                        value={recipe.videoUrl}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Image</Form.Label>
                    <Form.Control type="file" onChange={handleFileChange} />
                    {recipe.imageUrl && (
                        <img
                            src={recipe.imageUrl}
                            alt="Recipe"
                            className="mt-3"
                            style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }}
                        />
                    )}
                </Form.Group>

                <Button variant="success" type="submit" disabled={uploading}>
                    {uploading ? 'Uploading...' : 'Save Changes'}
                </Button>
                <Button
                    variant="secondary"
                    onClick={() => navigate(`/recipe/${id}`)}
                    className="ms-2"
                >
                    Cancel
                </Button>
            </Form>
        </Container>
    );
};

export default EditRecipe;
