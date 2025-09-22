import { useState } from "react";
import styles from "./planner.module.css";
import Nav from "./Nav/Nav";
import FoodDetails from "./FoodDetails";
import { translateTexts } from "./Translation";

const SPOONACULAR_URL = "https://api.spoonacular.com/mealplanner/generate";
const SPOONACULAR_API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY;

const dayTranslations: { [key: string]: string } = {
    monday: 'Segunda-feira',
    tuesday: 'Terça-feira',
    wednesday: 'Quarta-feira',
    thursday: 'Quinta-feira',
    friday: 'Sexta-feira',
    saturday: 'Sábado',
    sunday: 'Domingo'
};

export default function Planner() {

    const [weekPlan, setWeekPlan] = useState<any>({});
    const [dayPlan, setDayPlan] = useState<any>(null);
    const [planType, setPlanType] = useState<'week' | 'day' | null>(null);
    const [foodId, setFoodId] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const [searchParams, setSearchParams] = useState({
        targetCalories: "",
        diet: "",
        exclude: "",
    });

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target;
        setSearchParams({ ...searchParams, [name]: value });
    }

    
    async function generatePlan(timeFrame: 'week' | 'day') {
        const params = new URLSearchParams({
            apiKey: SPOONACULAR_API_KEY,
            timeFrame: timeFrame,
        });

        if (searchParams.targetCalories) params.append("targetCalories", searchParams.targetCalories);
        if (searchParams.diet) params.append("diet", searchParams.diet);
        if (searchParams.exclude) params.append("exclude", searchParams.exclude);

        const res = await fetch(`${SPOONACULAR_URL}?${params.toString()}`);
        const data = await res.json();
        
        setPlanType(timeFrame);

        if (timeFrame === 'week' && data.week) {
            const allMeals = Object.values(data.week).flatMap((day: any) => day.meals);
            const titlesToTranslate = allMeals.map((meal: any) => meal.title);
            const translatedTitles = await translateTexts(titlesToTranslate);

            let titleIndex = 0;
            const translatedWeekPlan = { ...data.week };
            for (const day in translatedWeekPlan) {
                translatedWeekPlan[day].meals = translatedWeekPlan[day].meals.map((meal: any) => ({
                    ...meal,
                    title: translatedTitles[titleIndex++],
                }));
            }
            
            setWeekPlan(translatedWeekPlan);
            setDayPlan(null);
        } else if (timeFrame === 'day' && data.meals) {
            const titlesToTranslate = data.meals.map((meal: any) => meal.title);
            const translatedTitles = await translateTexts(titlesToTranslate);
            
            const translatedDayPlan = {
                ...data,
                meals: data.meals.map((meal: any, index: number) => ({
                    ...meal,
                    title: translatedTitles[index],
                })),
            };

            setDayPlan(translatedDayPlan);
            setWeekPlan({});
        }
        setIsLoading(false);
    }

    return (
        <>
            <Nav />
            <div className={styles.plannerContainer}>
                <div className={styles.formContainer}>
                    <input className={styles.input} type="text" name="targetCalories" value={searchParams.targetCalories} onChange={handleChange} placeholder="Meta de Calorias" />
                    <input className={styles.input} type="text" name="exclude" value={searchParams.exclude} onChange={handleChange} placeholder="Não incluir (por exemplo, Frutos do Mar)" />
                    <select className={styles.input} name="diet" value={searchParams.diet} onChange={handleChange}>
                        <option value="">Selecione dieta</option>
                        <option value="vegetarian">Vegetariano</option>
                        <option value="vegan">Vegano</option>
                        <option value="glutenFree">Sem glúten</option>
                        <option value="pescetarian">Pescetariano</option>
                    </select>
                    <div className={styles.buttonGroup}>
                        <button className={styles.button} onClick={() => generatePlan('day')} disabled={isLoading}>
                            Gerar Plano Diário
                        </button>
                        <button className={styles.button} onClick={() => generatePlan('week')} disabled={isLoading}>
                            Gerar Plano Semanal
                        </button>
                    </div>
                </div>

                {isLoading && <p>Carregando plano...</p>}

                {planType === 'week' && (
                    <div className={styles.mealPlanContainer}>
                        {Object.entries(weekPlan).map(([day, dayData]: [string, any]) => (
                            <div key={day} className={styles.dayColumn}>
                                <h2>{dayTranslations[day] || day.charAt(0).toUpperCase() + day.slice(1)}</h2>
                            <div className={styles.meals}>
                                    {dayData.meals.map((meal: any) => (
                                        <div key={meal.id} className={styles.mealCard}>
                                            <h3>{meal.title}</h3>
                                            <p>Pronto em: {meal.readyInMinutes} minutos</p>
                                            <button className={styles.viewButton} onClick={() => setFoodId(meal.id)}>
                                                Ver Receita
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <div className={styles.nutrients}>
                                    <h4>Nutrientes Diários</h4>
                                    <p>Calorias: {dayData.nutrients.calories.toFixed(0)}</p>
                                    <p>Proteína: {dayData.nutrients.protein.toFixed(0)}g</p>
                                    <p>Gordura: {dayData.nutrients.fat.toFixed(0)}g</p>
                                    <p>Carboidrato: {dayData.nutrients.carbohydrates.toFixed(0)}g</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {planType === 'day' && dayPlan && (
                    <div className={styles.mealPlanContainer}>
                        <div className={styles.dayColumn}>
                            <h2>Plano de hoje</h2>
                            <div className={styles.meals}>
                                {dayPlan.meals.map((meal: any) => (
                                    <div key={meal.id} className={styles.mealCard}>
                                        <h3>{meal.title}</h3>
                                        <p>Pronto em: {meal.readyInMinutes} minutos</p>
                                        <button className={styles.viewButton} onClick={() => setFoodId(meal.id)}>
                                            Ver Receita
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className={styles.nutrients}>
                                <h4>Nutrientes Diários</h4>
                                <p>Calorias: {dayPlan.nutrients.calories.toFixed(0)}</p>
                                <p>Proteína: {dayPlan.nutrients.protein.toFixed(0)}g</p>
                                <p>Gordura: {dayPlan.nutrients.fat.toFixed(0)}g</p>
                                <p>Carboidrato: {dayPlan.nutrients.carbohydrates.toFixed(0)}g</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {foodId && <FoodDetails foodId={foodId} setFoodId={setFoodId} />}
        </>
    );
}