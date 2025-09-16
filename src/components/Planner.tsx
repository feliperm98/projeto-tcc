import { useState } from "react";
import styles from "./planner.module.css";
import Nav from "./Nav/Nav";
import FoodDetails from "./FoodDetails";

const URL = "https://api.spoonacular.com/mealplanner/generate";
const apiKey = "c1ff7152323a4667a464a6b0132defa4";

export default function Planner() {

    const [weekPlan, setWeekPlan] = useState<any>({});
    const [foodId, setFoodId] = useState("");

    const [searchParams, setSearchParams] = useState({
        timeFrame: "week",
        targetCalories: "",
        diet: "",
        exclude: "",
    });

    // 2. Generic handler to update the state object
    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target;
        setSearchParams({ ...searchParams, [name]: value });
    }

    async function generatePlan() {
        const params = new URLSearchParams({
            apiKey: apiKey,
        });

        // Append parameters only if they have a value
        if (searchParams.timeFrame) params.append("timeFrame", searchParams.timeFrame);
        if (searchParams.targetCalories) params.append("targetCalories", searchParams.targetCalories);
        if (searchParams.diet) params.append("diet", searchParams.diet);
        if (searchParams.exclude) params.append("exclude", searchParams.exclude);

        const res = await fetch(`${URL}?${params.toString()}`);
        const data = await res.json();
        console.log(data.week);
        setWeekPlan(data.week);
    }

    return (
        <><Nav /><div className={styles.plannerContainer}>
            <h1>Meal Planner</h1>
            <div className={styles.formContainer}>
                <input className={styles.input} type="text" name="targetCalories" value={searchParams.targetCalories} onChange={handleChange} placeholder="Target Calories" />
                <input className={styles.input} type="text" name="diet" value={searchParams.diet} onChange={handleChange} placeholder="Diet (e.g., vegetarian)" />
                <input className={styles.input} type="text" name="exclude" value={searchParams.exclude} onChange={handleChange} placeholder="Exclude (e.g., shellfish)" />
                <button className={styles.button} onClick={generatePlan}>
                    Generate Weekly Plan
                </button>
            </div>

            <div className={styles.mealPlanContainer}>
                {Object.entries(weekPlan).map(([day, dayData]: [string, any]) => (
                    <div key={day} className={styles.dayColumn}>
                        <h2>{day.charAt(0).toUpperCase() + day.slice(1)}</h2>
                        <div className={styles.meals}>
                            {dayData.meals.map((meal: any) => (
                                <div key={meal.id} className={styles.mealCard}>
                                    <h3>{meal.title}</h3>
                                    <p>Ready in: {meal.readyInMinutes} minutes</p>
                                    <button className={styles.viewButton} onClick={() => setFoodId(meal.id)}>
                                        View Recipe
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className={styles.nutrients}>
                            <h4>Daily Nutrients</h4>
                            <p>Calories: {dayData.nutrients.calories.toFixed(0)}</p>
                            <p>Protein: {dayData.nutrients.protein.toFixed(0)}g</p>
                            <p>Fat: {dayData.nutrients.fat.toFixed(0)}g</p>
                            <p>Carbs: {dayData.nutrients.carbohydrates.toFixed(0)}g</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        {foodId && <FoodDetails foodId={foodId} setFoodId={setFoodId} />}
        </>
    );
}