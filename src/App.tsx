import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Search from "./components/Search"
import FoodList from "./components/FoodList";
import Nav from "./components/Nav/Nav";
import './App.css';
import Container from "./components/Container";
import InnerContainer from "./components/InnerContainer";
import FoodDetails from "./components/FoodDetails";
import Planner from "./components/Planner";

function SearchRecipe() {
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
    </Container>
    {foodId && <FoodDetails foodId={foodId} setFoodId={setFoodId} />}
  </div>
  )
}

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<SearchRecipe />} />
        <Route path="/planner" element={<Planner />} />
      </Routes>
    </div>
  );
}

export default App
