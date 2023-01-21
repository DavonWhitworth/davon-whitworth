import styled from "styled-components";
//import Pic from "../projectpics/portrait.jpg";

const Headcard = styled.div`
  width: 100%;
  min-width: 300px;
  max-width: 1024px;
  font-family: "HELVETICA";
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

const Titlediv = styled.h3`
  color: rgba(255, 255, 255, 0.9);
`;

const Namediv = styled.h1`
  font-size: 3em;
`;

// const Portrait = styled.img`
//   border-radius: 10px;
//   min-width: 300px;
// `;

const introCard = () => {
  return (
    <Headcard>
      <Infodiv>
        <Namediv>Davon Whitworth</Namediv>
        <Titlediv>Frontend Software Engineer</Titlediv>
      </Infodiv>
    </Headcard>
  );
};

export default introCard;
