import { useState } from "react";
import Search from "./components/Search"
import FoodList from "./components/FoodList";
import Nav from "./components/Nav/Nav";
import './App.css';
import Container from "./components/Container";
import InnerContainer from "./components/InnerContainer";
import FoodDetails from "./components/FoodDetails";

function App() {
  const [foodData, setFoodData] = useState([]);
  const [foodId, setFoodId] = useState("");

  return  (
  <div className="App">
    <Nav />
    <Search foodData={foodData} setFoodData={setFoodData} />
    <Container>
      <InnerContainer>
        <FoodList setFoodId={setFoodId} foodData={foodData}/>
      </InnerContainer>
      {/* 
      <InnerContainer>
        <FoodDetails foodId={foodId}/>
      </InnerContainer>
      */}
      
    </Container>
    {foodId && <FoodDetails foodId={foodId} setFoodId={setFoodId} />}
  </div>
  )
}

export default App
