import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { db } from '../firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';

const EditRecipe = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [recipe, setRecipe] = useState({
        title: '',
        description: '',
        ingredients: [],
        steps: [],
        videoUrl: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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

        if (location.state?.recipe) {
            setRecipe(location.state.recipe);
            setLoading(false);
        } else {
            fetchRecipe();
        }
    }, [id, location]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRecipe((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleArrayChange = (index, value, field) => {
        setRecipe((prev) => {
            const updatedArray = [...prev[field]];
            updatedArray[index] = value;
            return { ...prev, [field]: updatedArray };
        });
    };

    const addArrayItem = (field) => {
        setRecipe((prev) => ({
            ...prev,
            [field]: [...prev[field], ''],
        }));
    };

    const removeArrayItem = (index, field) => {
        setRecipe((prev) => {
            const updatedArray = [...prev[field]];
            updatedArray.splice(index, 1);
            return { ...prev, [field]: updatedArray };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const docRef = doc(db, 'recipes', id);
            await updateDoc(docRef, recipe);
            alert('Recipe updated successfully!');
            navigate(`/recipe/${id}`);
        } catch (error) {
            alert('Failed to update recipe. Please try again.');
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

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
                    {recipe.ingredients.map((ingredient, index) => (
                        <Row key={index} className="mb-2">
                            <Col>
                                <Form.Control
                                    type="text"
                                    value={ingredient}
                                    onChange={(e) =>
                                        handleArrayChange(index, e.target.value, 'ingredients')
                                    }
                                />
                            </Col>
                            <Col xs="auto">
                                <Button
                                    variant="danger"
                                    onClick={() => removeArrayItem(index, 'ingredients')}
                                >
                                    Remove
                                </Button>
                            </Col>
                        </Row>
                    ))}
                    <Button
                        variant="primary"
                        onClick={() => addArrayItem('ingredients')}
                        className="mt-2"
                    >
                        Add Ingredient
                    </Button>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Steps</Form.Label>
                    {recipe.steps.map((step, index) => (
                        <Row key={index} className="mb-2">
                            <Col>
                                <Form.Control
                                    type="text"
                                    value={step}
                                    onChange={(e) =>
                                        handleArrayChange(index, e.target.value, 'steps')
                                    }
                                />
                            </Col>
                            <Col xs="auto">
                                <Button
                                    variant="danger"
                                    onClick={() => removeArrayItem(index, 'steps')}
                                >
                                    Remove
                                </Button>
                            </Col>
                        </Row>
                    ))}
                    <Button variant="primary" onClick={() => addArrayItem('steps')} className="mt-2">
                        Add Step
                    </Button>
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

                <Button variant="success" type="submit">
                    Save Changes
                </Button>
                <Button variant="secondary" onClick={() => navigate(`/recipe/${id}`)} className="ms-2">
                    Cancel
                </Button>
            </Form>
        </Container>
    );
};

export default EditRecipe;
