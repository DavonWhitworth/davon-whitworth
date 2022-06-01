import Projectcard from "./projectcard";
import styled from "styled-components";

const Projectblock = styled.div`
  padding: 10px;
  background-color: #121111;
  width 70%;
  border-radius: 15px;
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
        imagesrc="../projectpics/Poppic.PNG"
        imagealt="Pop Pic"
        link="https://gage-langdon.com/pop/"
      />
    </Projectblock>
  );
};

export default Projectlist;
