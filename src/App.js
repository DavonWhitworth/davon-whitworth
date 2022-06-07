import "./App.css";
import Projects from "./components/projectlist";
import IntroCard from "./components/introcard";
import Contactinfo from "./components/contactinfo";
import Banner from "./components/headbanner";

const App = () => {
  return (
    <>
      <Banner />
      <div className="pagediv">
        <IntroCard />
        <Contactinfo />
        <Projects />
      </div>
    </>
  );
};

export default App;
