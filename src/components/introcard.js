import styled from "styled-components";
import Pic from "../projectpics/portrait.jpg";

const Headcard = styled.div`
  width: auto;
  margin: 0px 10px 10px 10px;
  display: flex;
  align-items: flex-end;
  flex-wrap: wrap;
  justify-content: center;
`;

const Infodiv = styled.div`
  color: white;
  grid-column-start: 2;
  margin-right: 100px;
  flex-wrap: nowrap;
`;

const Portrait = styled.img`
  border-radius: 10px;
  min-width: 300px;
`;

const introCard = () => {
  return (
    <Headcard>
      <Portrait
        border-radius="50%"
        src={Pic}
        alt="Portrait of Davon Whitworth"
        width="40%"
      />
      <Infodiv>
        <h1>Davon Whitworth</h1>
        <h3>Junior Frontend Developer</h3>
      </Infodiv>
    </Headcard>
  );
};

export default introCard;
