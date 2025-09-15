import FoodItem from "./FoodItem";
import styles from "./foodList.module.css";

export default function FoodList({foodData, setFoodId}: {foodData: any, setFoodId: any}) {
    return <div className={styles.foodListContainer}>
        {foodData.map((food: any) => (
      <FoodItem setFoodId={setFoodId} key={food.id} food={food} />
    ))}
    </div>
}