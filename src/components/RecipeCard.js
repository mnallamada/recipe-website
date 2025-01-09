import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const RecipeCard = ({ recipe }) => {
    return (
        <Card className="m-3" style={{ width: '18rem' }}>
            <Link to={`/recipe/${recipe.id}`}>
                <Card.Img variant="top" src={recipe.image} alt={recipe.title} />
            </Link>
            <Card.Body>
                <Card.Title>{recipe.title}</Card.Title>
                <Card.Text>{recipe.description}</Card.Text>
            </Card.Body>
        </Card>
    );
};

export default RecipeCard;