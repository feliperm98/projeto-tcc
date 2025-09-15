import { useState } from "react";
import styles from "./search.module.css";

const URL = "https://api.spoonacular.com/recipes/complexSearch"
const apiKey = "c1ff7152323a4667a464a6b0132defa4";

export default function Search({ foodData, setFoodData }: { foodData: any; setFoodData: any }) {

    const [searchParams, setSearchParams] = useState({
        query: "",
        cuisine: "",
        diet: "",
        intolerances: "",
    });

    // 2. Generic handler to update the state object
    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target;
        setSearchParams({ ...searchParams, [name]: value });
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
        if (searchParams.intolerances) params.append("intolerances", searchParams.intolerances);

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

            <select className={styles.input} name="intolerances" value={searchParams.intolerances} onChange={handleChange}>
                <option value="">Select Intolerance</option>
                <option value="eairy">Dairy</option>
                <option value="egg">Egg</option>
                <option value="gluten">Gluten</option>
                <option value="grain">Grain</option>
                <option value="peanut">Peanut</option>
                <option value="seafood">Seafood</option>
                <option value="sesame">Sesame</option>
                <option value="shellfish">Shellfish</option>
                <option value="soy">Soy</option>
                <option value="sulfite">Sultite</option>
                <option value="tree-nut">Tree Nut</option>
                <option value="wheat">Wheat</option>
            </select>

            <button className={styles.button} onClick={searchRecipe}>
                Search
            </button>
        </div>
    );
}