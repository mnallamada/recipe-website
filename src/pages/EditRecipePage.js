import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { auth } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';

const EditRecipePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState(null);
    const [error, setError] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const fetchUser = () => {
            onAuthStateChanged(auth, async (user) => {
                if (user) {
                    const userDoc = await getDoc(doc(db, 'users', user.uid));
                    setIsAdmin(userDoc.exists() && userDoc.data().role === 'admin');
                }
            });
        };

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
            }
        };

        fetchUser();
        fetchRecipe();
    }, [id]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const docRef = doc(db, 'recipes', id);
            await updateDoc(docRef, recipe);
            navigate('/');
        } catch (error) {
            setError('Failed to update recipe');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRecipe({ ...recipe, [name]: value });
    };

    if (!isAdmin) {
        return <Alert variant="danger">You are not authorized to edit this recipe.</Alert>;
    }

    if (!recipe) {
        return error ? <Alert variant="danger">{error}</Alert> : <p>Loading...</p>;
    }

    return (
        <Container className="mt-5">
            <h1>Edit Recipe</h1>
            <Form onSubmit={handleUpdate}>
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
                        name="description"
                        value={recipe.description}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Image URL</Form.Label>
                    <Form.Control
                        type="text"
                        name="image"
                        value={recipe.image}
                        onChange={handleChange}
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
                <Button variant="primary" type="submit">Update Recipe</Button>
            </Form>
        </Container>
    );
};

export default EditRecipePage;