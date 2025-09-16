import { useState } from "react";
import styles from "./search.module.css";

const URL = "https://api.spoonacular.com/recipes/complexSearch"
const apiKey = "c1ff7152323a4667a464a6b0132defa4";

const intoleranceOptions = [
    { value: 'dairy', label: 'Dairy' },
    { value: 'egg', label: 'Egg' },
    { value: 'gluten', label: 'Gluten' },
    { value: 'grain', label: 'Grain' },
    { value: 'peanut', label: 'Peanut' },
    { value: 'seafood', label: 'Seafood' },
    { value: 'sesame', label: 'Sesame' },
    { value: 'shellfish', label: 'Shellfish' },
    { value: 'soy', label: 'Soy' },
    { value: 'sulfite', label: 'Sulfite' },
    { value: 'tree-nut', label: 'Tree Nut' },
    { value: 'wheat', label: 'Wheat' }
];

export default function Search({ foodData, setFoodData }: { foodData: any; setFoodData: any }) {

    const [searchParams, setSearchParams] = useState({
        query: "",
        cuisine: "",
        diet: "",
        intolerances: [] as string[],
    });

    // 2. Generic handler to update the state object
    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target;
        setSearchParams({ ...searchParams, [name]: value });
    
    }

    function handleCheckboxChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { value, checked } = e.target;
        setSearchParams(prevParams => {
            const newIntolerances = checked
                ? [...prevParams.intolerances, value] // Add to array if checked
                : prevParams.intolerances.filter(item => item !== value); // Remove if unchecked
            return { ...prevParams, intolerances: newIntolerances };
        });
    }

    async function searchRecipe() {
        // 3. Build the query string dynamically
        const params = new URLSearchParams({
            apiKey: apiKey,
        });

        // Append parameters only if they have a value
        if (searchParams.query) params.append("query", searchParams.query);
        if (searchParams.cuisine) params.append("cuisine", searchParams.cuisine);
        if (searchParams.diet) params.append("diet", searchParams.diet);
        if (searchParams.intolerances.length > 0) {
            params.append("intolerances", searchParams.intolerances.join(","));
        }

        const res = await fetch(`${URL}?${params.toString()}`);
        const data = await res.json();
        console.log(data.results);
        setFoodData(data.results);
    }

    return (
        <div className={styles.searchContainer}>
            <input
                className={styles.input}
                name="query" // Add name attribute
                value={searchParams.query}
                onChange={handleChange}
                type="text"
                placeholder="Search for a recipe..."
            />
            {/* Example for a 'cuisine' text input */}
            <input
                className={styles.input}
                name="cuisine"
                value={searchParams.cuisine}
                onChange={handleChange}
                type="text"
                placeholder="Cuisine (e.g., Italian)"
            />
            {/* Example for a 'diet' dropdown */}
            <select className={styles.input} name="diet" value={searchParams.diet} onChange={handleChange}>
                <option value="">Select Diet</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="glutenFree">Gluten Free</option>
                <option value="pescetarian">Pescetarian</option>
            </select>

            <div className={styles.checkboxContainer}>
                <h4 className={styles.checkboxTitle}>Intolerances</h4>
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
                Search
            </button>
        </div>
    );
}