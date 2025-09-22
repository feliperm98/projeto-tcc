import { useState } from "react";
import styles from "./search.module.css";
import { translateTexts } from "./Translation";

const SPOONACULAR_URL = "https://api.spoonacular.com/recipes/complexSearch";
const SPOONACULAR_API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY;

const TRANSLATE_URL = `https://translation.googleapis.com/language/translate/v2`;
const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

const intoleranceOptions = [
    { value: 'dairy', label: 'Leite' },
    { value: 'egg', label: 'Ovo' },
    { value: 'gluten', label: 'Glúten' },
    { value: 'grain', label: 'Grãos' },
    { value: 'peanut', label: 'Amendoim' },
    { value: 'seafood', label: 'Frutos do mar' },
    { value: 'sesame', label: 'Gergelim' },
    { value: 'shellfish', label: 'Mariscos' },
    { value: 'soy', label: 'Soja' },
    { value: 'sulfite', label: 'Sulfito' },
    { value: 'tree-nut', label: 'Nozes' },
    { value: 'wheat', label: 'Trigo' }
];

async function translateToEnglish(text: string): Promise<string> {
    if (!GOOGLE_API_KEY || !text.trim()) {
        return text;
    }

    try {
        const response = await fetch(`${TRANSLATE_URL}?key=${GOOGLE_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                q: text,
                target: 'en',
                source: 'pt', 
            }),
        });

        if (!response.ok) {
            throw new Error('Translation to English failed');
        }

        const data = await response.json();
        return data.data.translations[0].translatedText;
    } catch (error) {
        console.error("Translation to English failed:", error);
        return text; 
    }
}

export default function Search({ foodData, setFoodData }: { foodData: any; setFoodData: any }) {

    const [searchParams, setSearchParams] = useState({
        query: "",
        cuisine: "",
        diet: "",
        intolerances: [] as string[],
    });

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target;
        setSearchParams({ ...searchParams, [name]: value });
    
    }

    function handleCheckboxChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { value, checked } = e.target;
        setSearchParams(prevParams => {
            const newIntolerances = checked
                ? [...prevParams.intolerances, value]
                : prevParams.intolerances.filter(item => item !== value);
            return { ...prevParams, intolerances: newIntolerances };
        });
    }

    async function searchRecipe() {
        const params = new URLSearchParams({
            apiKey: SPOONACULAR_API_KEY,
        });

        const translatedQuery = await translateToEnglish(searchParams.query);
        const translatedCuisine = await translateToEnglish(searchParams.cuisine);


        params.append("number", "20");

        if (translatedQuery) params.append("query", translatedQuery);
        if (translatedCuisine) params.append("cuisine", translatedCuisine);
        if (searchParams.diet) params.append("diet", searchParams.diet);
        if (searchParams.intolerances.length > 0) {
            params.append("intolerances", searchParams.intolerances.join(","));
        }

        const res = await fetch(`${SPOONACULAR_URL}?${params.toString()}`);
        const data = await res.json();
        console.log(data);

        if (data.results && data.results.length > 0) {   

            const titlesToTranslate = data.results.map((recipe: any) => recipe.title);
            
            const translatedTitles = await translateTexts(titlesToTranslate);

            const translatedRecipes = data.results.map((recipe: any, index: number) => ({
                ...recipe,
                title: translatedTitles[index],
            }));

            setFoodData(translatedRecipes);
        } else {
            setFoodData([]);
        }
    }

        function handleKeyDown(e: React.KeyboardEvent) {
        if (e.key === 'Enter') {
            searchRecipe();
        }
    }

    return (
        <div className={styles.searchContainer}>
            <input
                className={styles.input}
                name="query"
                value={searchParams.query}
                onChange={handleChange}
                type="text"
                placeholder="Procure uma receita..."
                onKeyDown={handleKeyDown}
            />
            <input
                className={styles.input}
                name="cuisine"
                value={searchParams.cuisine}
                onChange={handleChange}
                type="text"
                placeholder="Culinária (por exemplo, Italiana)"
                onKeyDown={handleKeyDown}
            />
            <select className={styles.input} name="diet" value={searchParams.diet} onChange={handleChange}>
                <option value="">Selecione dieta</option>
                <option value="vegetarian">Vegetariano</option>
                <option value="vegan">Vegano</option>
                <option value="glutenFree">Sem glúten</option>
                <option value="pescetarian">Pescetariano</option>
            </select>

            <div className={styles.checkboxContainer}>
                <h4 className={styles.checkboxTitle}>Intolerâncias</h4>
                <div className={styles.checkboxGrid}>
                    {intoleranceOptions.map(option => (
                        <div key={option.value} className={styles.checkboxItem}>
                            <input
                                type="checkbox"
                                id={option.value}
                                value={option.value}
                                checked={searchParams.intolerances.includes(option.value)}
                                onChange={handleCheckboxChange}
                            />
                            <label htmlFor={option.value}>{option.label}</label>
                        </div>
                    ))}
                </div>
            </div>


            <button className={styles.button} onClick={searchRecipe}>
                Buscar
            </button>
        </div>
    );
}