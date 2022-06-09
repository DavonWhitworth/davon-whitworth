import Projectcard from "./projectcard";
import styled from "styled-components";
import Poppicture from "../projectpics/Poppic.PNG";
import Typingtestpicture from "../projectpics/typingtestpic.PNG";
import Lightsitepicture from "../projectpics/lightsitepic.PNG";

const Projectblock = styled.div`
  padding: 5px 30px 5px 30px;
  background-color: #171717;

  border-radius: 9px;
  max-width: fit-content;
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
        imagealt="Pop Pic"
        link="https://gage-langdon.com/pop/"
      />
      <Projectcard
        title="Vocabulary typing test"
        languages="React"
        description="A typing test that also helps you improve your vocabulary"
        imagesrc={Typingtestpicture}
        imagealt="Vocabulary typing test"
      />
      <Projectcard
        title="Light sight"
        languages="React"
        description="A site where you can illuminate your beautiful face with the color of your choice using your screen"
        imagesrc={Lightsitepicture}
        imagealt="Vocabulary typing test"
      />
    </Projectblock>
  );
};

export default Projectlist;
