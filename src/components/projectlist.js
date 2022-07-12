import Projectcard from "./projectcard";
import styled from "styled-components";
import Poppicture from "../projectpics/Poppic.PNG";
import Typingtestpicture from "../projectpics/typingtestpic.PNG";
import Lightsitepicture from "../projectpics/lightsitepic.PNG";

const Projectblock = styled.div`
  padding: 5px 30px 5px 30px;
  background-color: #171717;
  margin: auto;
  border-radius: 6px;
  width: fit-content;
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
        title="Vocab typer"
        languages="React"
        description="Vocab Typer is a typing test that can help anyone improve their typing speed and develop their vocabulary. The app calls a dictionary API to create the set text the user types. After each term, the netWPM and average netWPM update, giving information on your performance."
        imagesrc={Typingtestpicture}
        imagealt="Vocabulary typing test picture"
      />
      <Projectcard
        title="Light sight"
        languages="React"
        description="Light Site is a react app with various colored buttons that change the background of the page enabling the user to illuminate their face and surrounding environment with the color of their choosing."
        imagesrc={Lightsitepicture}
        imagealt="Light sight picture"
      />
    </Projectblock>
  );
};

export default Projectlist;
