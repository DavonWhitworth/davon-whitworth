import "./App.css";
import Projects from "./components/projectlist";
import IntroCard from "./components/introcard";
import Contactinfo from "./components/contactinfo";
import Banner from "./components/headbanner";
import AboutMe from "./components/aboutme";
import styled from "styled-components";

const PersonalInfo = styled.div`
margin: 15px auto 15px auto;
display: flex;
flex-wrap: reverse;
`

const App = () => {
  return (
    <>
      <Banner />
      <div className="pagediv">
        <IntroCard />
        <PersonalInfo>
          <Contactinfo />
          <AboutMe/>
        </PersonalInfo>
        <Projects />
      </div>
    </>
  );
};

export default App;
