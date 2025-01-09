import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase/config';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { Row, Col, Container } from 'react-bootstrap';
import RecipeCard from '../components/RecipeCard';
import AppNavbar from '../components/Navbar';
import { onAuthStateChanged } from 'firebase/auth';

const HomePage = () => {
    const [favorites, setFavorites] = useState([]);
    const [allRecipes, setAllRecipes] = useState([]);
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsAuth(!!user);
            if (user) fetchFavorites(user.uid);
        });

        fetchAllRecipes();

        return () => unsubscribe(); // Clean up the listener
    }, []);

    const fetchFavorites = async (userId) => {
        const favRef = doc(db, 'favorites', userId);
        const favDoc = await getDoc(favRef);

        if (favDoc.exists()) {
            const favoriteIds = favDoc.data().recipeIds || [];
            const favRecipes = await Promise.all(
                favoriteIds.map(async (id) => {
                    const recipeDoc = await getDoc(doc(db, 'recipes', id));
                    return recipeDoc.exists() ? { id, ...recipeDoc.data() } : null;
                })
            );

            setFavorites(favRecipes.filter((recipe) => recipe !== null));
        } else {
            setFavorites([]);
        }
    };

    const fetchAllRecipes = async () => {
        const recipesQuery = await getDocs(collection(db, 'recipes'));
        setAllRecipes(
            recipesQuery.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
    };

    return (
        <>
            <AppNavbar />
            <Container className="mt-5">
                {isAuth && (
                    <Row>
                        <h2>Favorite Recipes</h2>
                        {favorites.length > 0 ? (
                            favorites.map((recipe) => (
                                <Col key={recipe.id} md={4}>
                                    <RecipeCard recipe={recipe} />
                                </Col>
                            ))
                        ) : (
                            <p>No favorites yet.</p>
                        )}
                    </Row>
                )}
                <Row className="mt-4">
                    <h2>All Recipes</h2>
                    {allRecipes.map((recipe) => (
                        <Col key={recipe.id} md={4}>
                            <RecipeCard recipe={recipe} />
                        </Col>
                    ))}
                </Row>
            </Container>
        </>
    );
};

export default HomePage;