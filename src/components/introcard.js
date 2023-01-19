import styled from "styled-components";
//import Pic from "../projectpics/portrait.jpg";

const Headcard = styled.div`
  width: 100%;
  min-width: 300px;
  max-width: 1024px;

  display: flex;
  align-items: flex-end;
  flex-wrap: wrap;
  justify-content: center;
  align-self: center;
  gap: 15px;
  margin: 100px auto;
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
        <h3>Frontend Software Engineer</h3>
      </Infodiv>
    </Headcard>
  );
};

export default introCard;
