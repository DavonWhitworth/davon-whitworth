import styled from "styled-components";
import Pic from "../projectpics/portrait.jpg";

const Headcard = styled.div`
  width: 71.5%;
  margin: 0px 10px 10px 10px;
  display: flex;
  align-items: flex-end;
  flex-wrap: wrap;
`;

const Infodiv = styled.div`
  color: white;
  grid-column-start: 2;
  margin-right: 100px;
`;

const introCard = () => {
  return (
    <Headcard>
      <img src={Pic} alt="Portrait of Davon Whitworth" width="50%" />
      <Infodiv>
        <h1>Davon Whitworth</h1>
        <h3>Junior Frontend Developer</h3>
      </Infodiv>
    </Headcard>
  );
};

export default introCard;
