import { Link } from "react-router-dom";
import styles from "./nav.module.css";

export default function Nav(){
    return (
        <div className={styles.nav}>RecipeSearch
            <Link to="/" className={styles.navLink}>Search Recipe</Link>
            <Link to="/planner" className={styles.navLink}>Meal Planner</Link>
        </div>
    );
}