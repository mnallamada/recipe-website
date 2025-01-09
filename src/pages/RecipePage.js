import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase/config';
import { doc, getDoc, setDoc, deleteDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { Container, Button, Alert, Row, Col } from 'react-bootstrap';
import AppNavbar from '../components/Navbar';
import { onAuthStateChanged } from 'firebase/auth';

// Helper function to handle YouTube URLs
const getYouTubeEmbedURL = (url) => {
    try {
        const videoId = new URL(url).searchParams.get('v');
        if (!videoId) throw new Error('Invalid YouTube URL');
        return `https://www.youtube.com/embed/${videoId}`;
    } catch (error) {
        console.error('Invalid YouTube URL:', error.message);
        return ''; // Return an empty string or a fallback URL
    }
};

const RecipePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState({
        title: '',
        description: '',
        ingredients: [],
        steps: [],
        videoUrl: '',
    });
    const [error, setError] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        const fetchUser = () => {
            onAuthStateChanged(auth, async (user) => {
                if (user) {
                    const userDoc = await getDoc(doc(db, 'users', user.uid));
                    setIsAdmin(userDoc.exists() && userDoc.data().role === 'admin');

                    // Check if the recipe is a favorite
                    const favDoc = await getDoc(doc(db, 'favorites', user.uid));
                    if (favDoc.exists() && favDoc.data().recipeIds.includes(id)) {
                        setIsFavorite(true);
                    }
                }
            });
        };

        const fetchRecipe = async () => {
            try {
                const docRef = doc(db, 'recipes', id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    console.log("Recipe data:", data); // Debugging
                    setRecipe({
                        title: data.title || '',
                        description: data.description || '',
                        ingredients: data.ingredients || [],
                        steps: data.steps || [],
                        videoUrl: data.videoUrl || '',
                    });
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

    const handleFavorite = async () => {
        const user = auth.currentUser;
        if (!user) return alert('Please log in to favorite recipes.');

        const favRef = doc(db, 'favorites', user.uid);
        const favDoc = await getDoc(favRef);

        if (!favDoc.exists()) {
            await setDoc(favRef, { recipeIds: [id] });
        } else {
            await updateDoc(favRef, { recipeIds: arrayUnion(id) });
        }

        setIsFavorite(true);
    };

    const handleUnfavorite = async () => {
        const user = auth.currentUser;
        if (!user) return alert('Please log in to unfavorite recipes.');

        const favRef = doc(db, 'favorites', user.uid);
        await updateDoc(favRef, { recipeIds: arrayRemove(id) });
        setIsFavorite(false);
    };

    const handleDelete = async () => {
        if (!isAdmin) {
            alert('You are not authorized to delete this recipe.');
            return;
        }
        try {
            const docRef = doc(db, 'recipes', id);
            await deleteDoc(docRef);
            navigate('/');
        } catch (error) {
            alert('Failed to delete recipe');
        }
    };

    if (!recipe) return error ? <Alert variant="danger">{error}</Alert> : <p>Loading...</p>;

    return (
        <>
            <AppNavbar />
            <Container className="mt-5">
                <Row>
                    <Col>
                        {getYouTubeEmbedURL(recipe.videoUrl) ? (
                            <iframe
                                width="100%"
                                height="400"
                                src={getYouTubeEmbedURL(recipe.videoUrl)}
                                title={recipe.title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        ) : (
                            <p>Video unavailable</p>
                        )}
                    </Col>
                </Row>
                <Row className="mt-4">
                    <Col>
                        <h2>{recipe.title}</h2>
                        <p>{recipe.description}</p>
                    </Col>
                </Row>
                <Row className="mt-4">
                    <Col>
                        <h3>Ingredients</h3>
                        {recipe.ingredients && Array.isArray(recipe.ingredients) ? (
                            <ul>
                                {recipe.ingredients.map((ingredient, index) => (
                                    <li key={index}>{ingredient}</li>
                                ))}
                            </ul>
                        ) : (
                            <p>No ingredients available</p>
                        )}
                    </Col>
                </Row>
                <Row className="mt-4">
                    <Col>
                        <h3>Steps</h3>
                        {recipe.steps && Array.isArray(recipe.steps) ? (
                            <ul>
                                {recipe.steps.map((step, index) => (
                                    <li key={index}>{step}</li>
                                ))}
                            </ul>
                        ) : (
                            <p>No steps available</p>
                        )}
                    </Col>
                </Row>
                <Row className="mt-4">
                    <Col>
                        {isFavorite ? (
                            <Button variant="danger" onClick={handleUnfavorite} className="me-2">
                                Remove from Favorites
                            </Button>
                        ) : (
                            <Button variant="primary" onClick={handleFavorite} className="me-2">
                                Add to Favorites
                            </Button>
                        )}
                        {isAdmin && (
                            <>
                                <Button variant="secondary" onClick={() => navigate(`/edit-recipe/${id}`)} className="me-2">
                                    Edit Recipe
                                </Button>
                                <Button variant="danger" onClick={handleDelete}>
                                    Delete Recipe
                                </Button>
                            </>
                        )}
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default RecipePage;
