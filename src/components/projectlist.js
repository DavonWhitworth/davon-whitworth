import Projectcard from "./projectcard";
import styled from "styled-components";
import Poppicture from "../projectpics/Poppic.PNG";
import Typingtestpicture from "../projectpics/typingtestpic.PNG";
import Lightsitepicture from "../projectpics/lightsitepic.PNG";

const Projectblock = styled.div`
  padding: 5px 20px;
  background-color: #171717;
  margin: 5px;
  border-radius: 6px;
  width: fit-content;
  max-width: 1024px;
  display: flex;
  flex-direction: column;
`;

const Listheader = styled.h1`
  background-color: inherit;
  color: white;
  margin-left: 3%;
`;

const Projectlist = () => {
  return (
    <Projectblock>
      <Listheader>Hobby Projects</Listheader>
      <Projectcard
        title="Pop"
        languages="Unity"
        description="A web game I produced with my 2 brothers. A peacful top-down shooter which synchronizes the enemy waves with it's music track."
        imagesrc={Poppicture}
        imagealt="Pop picture"
        link="https://gage-langdon.com/pop/"
      />
      <Projectcard
        title="Vocabulary Typing Test"
        languages="React"
        description="Vocabulary Typing Test is a typing test that can help anyone improve their typing speed and develop their vocabulary. The app calls a dictionary API to create the set text the user types. After each term, the netWPM and average netWPM update, giving real time data on your performance."
        imagesrc={Typingtestpicture}
        imagealt="Vocabulary typing test picture"
      />
      <Projectcard
        title="Light Sight"
        languages="React"
        description="Light Sight is a react app with various colored buttons that change the background of the page enabling the user to illuminate their face and surrounding environment with the color of their choosing."
        imagesrc={Lightsitepicture}
        imagealt="Light sight picture"
        link="https://master--lightsight.netlify.app/"
      />
    </Projectblock>
  );
};

export default Projectlist;
