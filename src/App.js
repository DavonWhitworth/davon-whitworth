import "./App.css";
import Projects from "./components/projectlist";
import IntroCard from "./components/introcard";
import Contactinfo from "./components/contactinfo";
import Header from "./components/headbanner";

const App = () => {
  return (
    <>
      <Header />
      <IntroCard />
      <Contactinfo />
      <Projects />
    </>
  );
};

export default App;
