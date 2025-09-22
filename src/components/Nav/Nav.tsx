import { Link } from "react-router-dom";
import styles from "./nav.module.css";

export default function Nav(){
    return (
        <div className={styles.nav}>ReceitaFacil
            <Link to="/" className={styles.navLink}>Busque Receitas</Link>
            <Link to="/planner" className={styles.navLink}>Plano Alimentar</Link>
        </div>
    );
}