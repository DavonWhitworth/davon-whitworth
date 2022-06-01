import "./App.css";
import styled from "styled-components";
import Projects from "./components/projectlist";
import introCard from "./components/introcard";

const App = () => {
  return (
    <>
      <introCard />
      <Projects />
    </>
  );
};

export default App;
