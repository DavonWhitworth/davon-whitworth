import styled from "styled-components";
//import Pic from "../projectpics/portrait.jpg";

const Headcard = styled.div`
  width: auto;
  margin: 0px 10px 10px 10px;
  display: flex;
  align-items: flex-end;
  flex-wrap: wrap;
  justify-content: center;
  gap: 15px;
  margin-top: 100px;
`;

const Infodiv = styled.div`
  color: white;
  grid-column-start: 2;
  flex-wrap: nowrap;
  text-align: center;
`;

// const Portrait = styled.img`
//   border-radius: 10px;
//   min-width: 300px;
// `;

const introCard = () => {
  return (
    <Headcard>
      <Infodiv>
        <h1>Davon Whitworth</h1>
        <h3>Junior Frontend Developer</h3>
      </Infodiv>
    </Headcard>
  );
};

export default introCard;
