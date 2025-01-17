import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase/config';
import Image from 'react-bootstrap/Image';

import {
    doc,
    getDoc,
    setDoc,
    deleteDoc,
    updateDoc,
    arrayUnion,
    arrayRemove,
    collection,
    query,
    orderBy,
    onSnapshot,
    addDoc,
    getDocs
} from 'firebase/firestore';
import { Container, Button, Alert, Row, Col, Form } from 'react-bootstrap';
import AppNavbar from '../components/Navbar';
import { onAuthStateChanged } from 'firebase/auth';
import ReactStars from 'react-rating-stars-component';

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
        imageUrl: '',
    });
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [error, setError] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [averageRating, setAverageRating] = useState(0);
    const [totalRatings, setTotalRatings] = useState(0);

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
                    setRecipe({
                        title: data.title || '',
                        description: data.description || '',
                        ingredients: data.ingredients || [],
                        steps: data.steps || [],
                        videoUrl: data.videoUrl || '',
                        imageUrl: data.imageUrl || '',
                    });
                } else {
                    setError('Recipe not found');
                }
            } catch (error) {
                setError('Failed to load recipe');
            }
        };

        const fetchRatings = async () => {
            const ratingsRef = collection(db, `recipes/${id}/ratings`);
            const ratingsSnapshot = await getDocs(ratingsRef);

            const ratings = ratingsSnapshot.docs.map((doc) => doc.data().rating);
            if (ratings.length > 0) {
                const average = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
                setAverageRating(average);
                setTotalRatings(ratings.length);
            }
        };

        const fetchComments = () => {
            const commentsRef = collection(db, `recipes/${id}/comments`);
            const commentsQuery = query(commentsRef, orderBy('timestamp', 'desc'));

            onSnapshot(commentsQuery, (snapshot) => {
                setComments(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
            });
        };

        fetchUser();
        fetchRecipe();
        fetchRatings();
        fetchComments();
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

    const handleAddComment = async () => {
        const user = auth.currentUser;
        if (!user) {
            alert('Please log in to add a comment.');
            return;
        }

        if (!newComment.trim()) {
            alert('Comment cannot be empty.');
            return;
        }

        try {
            const commentsRef = collection(db, `recipes/${id}/comments`);
            await addDoc(commentsRef, {
                userId: user.uid,
                userName: user.displayName || 'Anonymous',
                content: newComment,
                timestamp: new Date(),
            });
            setNewComment('');
        } catch (error) {
            alert('Failed to add comment. Please try again.');
        }
    };

    const handleRate = async (newRating) => {
        const user = auth.currentUser;
        if (!user) {
            alert('Please log in to rate this recipe.');
            return;
        }

        try {
            const ratingsRef = doc(db, `recipes/${id}/ratings`, user.uid);
            await setDoc(ratingsRef, {
                userId: user.uid,
                rating: newRating,
            });

            // Recalculate average rating
            const ratingsSnapshot = await getDocs(collection(db, `recipes/${id}/ratings`));
            const ratings = ratingsSnapshot.docs.map((doc) => doc.data().rating);
            const average = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;

            setAverageRating(average);
            setTotalRatings(ratings.length);

            alert('Thanks for your rating!');
        } catch (error) {
            alert('Failed to submit rating. Please try again.');
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
                    <Col><Image src={recipe.imageUrl} fluid /></Col>
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
                        <h3>Rate this Recipe</h3>
                        <ReactStars
                            value={averageRating}
                            count={5}
                            size={30}
                            activeColor="#ffd700"
                            emptyIcon={<i className="far fa-star"></i>}
                            filledIcon={<i className="fas fa-star"></i>}
                            isHalf={true}
                            edit={true}
                            onChange={handleRate}
                        />
                        <p>Average Rating: {averageRating.toFixed(1)} ({totalRatings} ratings)</p>
                    </Col>
                </Row>
                <Row className="mt-5">
                    <Col>
                        <h3>Comments</h3>
                        {auth.currentUser ? (
                            <>
                                <Form>
                                    <Form.Group controlId="newComment">
                                        <Form.Label>Add a Comment</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Write your comment here..."
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                        />
                                    </Form.Group>
                                    <Button variant="primary" className="mt-3" onClick={handleAddComment}>
                                        Submit
                                    </Button>
                                </Form>
                            </>
                        ) : (
                            <p>
                                You need to log in to post a comment.{' '}
                                <Button
                                    variant="link"
                                    className="p-0"
                                    onClick={() => navigate('/login')}
                                >
                                    Click here to log in.
                                </Button>
                            </p>
                        )}

                        {comments.length > 0 ? (
                            <div className="mt-4">
                                {comments.map((comment) => (
                                    <div key={comment.id} className="mb-3">
                                        <strong>{comment.userName}</strong>: {comment.content}
                                        <br />
                                        <small className="text-muted">
                                            Posted on {new Date(comment.timestamp.seconds * 1000).toLocaleString()}
                                        </small>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="mt-4">No comments yet. Be the first to comment!</p>
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
