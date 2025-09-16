import { useEffect, useState } from "react";
import styles from "./foodDetails.module.css";

export default function FoodDetails({foodId, setFoodId}: {foodId: any, setFoodId: any}) {
    const [food, setFood] = useState<any>({});
    const apiKey = "c1ff7152323a4667a464a6b0132defa4";
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        async function fetchFoodDetails() {
            setIsLoading(true);
            if (foodId) {
                const URL = `https://api.spoonacular.com/recipes/${foodId}/information`;
                try {
                    const res = await fetch(`${URL}?apiKey=${apiKey}`);
                    const data = await res.json();
                    console.log(data);
                    setFood(data);
                    setIsLoading(false);
                } catch (error) {
                    console.error("Error fetching food details:", error);
                }
            }
        }
        fetchFoodDetails();
    }, [foodId]);

    return (
    <div className={styles.modalBackdrop}>
            <div className={styles.modalContent}>
                <button className={styles.closeButton} onClick={() => setFoodId("")}>×</button>
                {isLoading ? (
                    <p>Loading...</p>
                ) : (
    <div>
        <div className={styles.recipeCard}>
            <h1 className={styles.recipeName}>{food.title}</h1>
            <img className={styles.recipeImage} src={food.image} alt="" />
        
        <div className={styles.recipeDetails}>
            <span>
                <strong>⏱️ {food.readyInMinutes} Minutes</strong>
            </span>
            <span>
                <strong>{food.vegetarian ? "Vegetarian" : "Non-Vegetarian"}</strong>
            </span>
            <span>
                <strong>{food.vegan ? "Vegan" : ""}</strong>
            </span>
        </div>
        <div className={styles.recipeInstructions}>
            <h2>Ingredients</h2>
            <ul>
                {food.extendedIngredients && food.extendedIngredients.map((ingredient: any) => (
                    <li key={ingredient.id}>
                        {ingredient.original}
                    </li>
                ))}
            </ul>
        </div>
        <div className={styles.recipeInstructions}>
            <h2>Instructions</h2>
            {food.analyzedInstructions && food.analyzedInstructions.length > 0 ? (
                <ol>
                    {food.analyzedInstructions[0].steps.map((step: any) => (
                        <li key={step.number}>{step.step}</li>
                    ))}
                </ol>
            ) : (
                <p>No instructions available.</p>
            )}
        </div>
        </div>
    </div>
                )}
            </div>
        </div>
    );
}