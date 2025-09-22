import { useEffect, useState } from "react";
import styles from "./foodDetails.module.css";
import { translateTexts } from "./Translation";

export default function FoodDetails({foodId, setFoodId}: {foodId: any, setFoodId: any}) {
    const [food, setFood] = useState<any>({});
    const apiKey = import.meta.env.VITE_SPOONACULAR_API_KEY;
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
                    const ingredientsToTranslate = data.extendedIngredients?.map((ing: any) => ing.original) || [];
                    const instructionsToTranslate = data.analyzedInstructions?.[0]?.steps.map((s: any) => s.step) || [];
                    
                    const allTextsToTranslate = [
                        data.title,
                        ...ingredientsToTranslate, 
                        ...instructionsToTranslate
                    ];

                    const translatedTexts = await translateTexts(allTextsToTranslate);

                    const translatedFood = { ...data };
                    let currentIndex = 0;

                    translatedFood.title = translatedTexts[currentIndex++];

                    if (translatedFood.extendedIngredients) {
                        translatedFood.extendedIngredients = translatedFood.extendedIngredients.map((ing: any) => ({
                            ...ing,
                            original: translatedTexts[currentIndex++],
                        }));
                    }

                    if (translatedFood.analyzedInstructions && translatedFood.analyzedInstructions.length > 0) {
                        translatedFood.analyzedInstructions[0].steps = translatedFood.analyzedInstructions[0].steps.map((s: any) => ({
                            ...s,
                            step: translatedTexts[currentIndex++],
                        }));
                    }

                    setFood(translatedFood);
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
                <strong>⏱️ {food.readyInMinutes} Minutos</strong>
            </span>
            <span>
                <strong>{food.vegetarian ? "Vegetariano" : "Não Vegetariano"}</strong>
            </span>
            <span>
                <strong>{food.vegan ? "Vegano" : ""}</strong>
            </span>
        </div>
        <div className={styles.recipeInstructions}>
            <h2>Ingredientes</h2>
            <ul>
                {food.extendedIngredients && food.extendedIngredients.map((ingredient: any) => (
                    <li key={ingredient.id}>
                        {ingredient.original}
                    </li>
                ))}
            </ul>
        </div>
        <div className={styles.recipeInstructions}>
            <h2>Instruções</h2>
            {food.analyzedInstructions && food.analyzedInstructions.length > 0 ? (
                <ol>
                    {food.analyzedInstructions[0].steps.map((step: any) => (
                        <li key={step.number}>{step.step}</li>
                    ))}
                </ol>
            ) : (
                <p>Sem instruções.</p>
            )}
        </div>
        </div>
    </div>
                )}
            </div>
        </div>
    );
}