import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ReactStars from 'react-rating-stars-component';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

const RecipeCard = ({ recipe }) => {
    const [averageRating, setAverageRating] = useState(0);
    const [totalRatings, setTotalRatings] = useState(0);

    useEffect(() => {
        const fetchRatings = async () => {
            const ratingsRef = collection(db, `recipes/${recipe.id}/ratings`);
            const ratingsSnapshot = await getDocs(ratingsRef);

            const ratings = ratingsSnapshot.docs.map((doc) => doc.data().rating);
            if (ratings.length > 0) {
                const average = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
                setAverageRating(average);
                setTotalRatings(ratings.length);
            }
        };

        fetchRatings();
    }, [recipe.id]);

    return (
        <Card className="m-3" style={{ width: '18rem' }}>
            <Link to={`/recipe/${recipe.id}`}>
                <Card.Img variant="top" src={recipe.image} alt={recipe.title} />
            </Link>
            <Card.Body>
                <Card.Title>{recipe.title}</Card.Title>
                <Card.Text>{recipe.description}</Card.Text>
                <ReactStars
                    value={averageRating}
                    count={5}
                    size={24}
                    edit={false}
                    activeColor="#ffd700"
                    isHalf={true}
                />
                <p className="text-muted">{totalRatings > 0 ? `${totalRatings} ratings` : 'No ratings yet'}</p>
            </Card.Body>
        </Card>
    );
};

export default RecipeCard;
