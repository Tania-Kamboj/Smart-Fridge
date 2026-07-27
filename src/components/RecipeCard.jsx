import React from 'react';
import './RecipeCard.css';

const RecipeCard = ({ recipe }) => {
  if (!recipe) return null;
  
  return (
    <div className="recipe-card">
      <div className="recipe-image-container">
        <img
          src={recipe.strMealThumb}
          alt={recipe.strMeal}
          className="recipe-image"
          onError={(e) => {
            e.target.src = 'https://www.themealdb.com/images/media/meals/1550441882.jpg';
          }}
        />
        <div className="recipe-badge">{recipe.strCategory}</div>
      </div>
      <div className="recipe-content">
        <h3 className="recipe-title">{recipe.strMeal}</h3>
        <a
          href={recipe.strSource}
          target="_blank"
          rel="noopener noreferrer"
          className="recipe-link"
        >
          View Recipe →
        </a>
      </div>
    </div>
  );
};

export default RecipeCard;