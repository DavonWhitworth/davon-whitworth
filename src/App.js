import "./App.css";
import Projects from "./components/projectlist";
import IntroCard from "./components/introcard";
import Contactinfo from "./components/contactinfo";

const App = () => {
  return (
    <>
      <IntroCard />
      <Contactinfo />
      <Projects />
    </>
  );
};

export default App;
