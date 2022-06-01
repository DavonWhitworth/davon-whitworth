import styled from "styled-components";

const Headcard = styled.div`
  display: grid;
  grid-template-column: 1fr 1fr;
  border: 4px solid white;
`;

const introCard = () => {
  return (
    <Headcard>
      <h1>Davon Whitworth</h1>
      <h3>Jr. Frontend Developer</h3>
      <img src="../projectpics/portrait.jpg" alt="it's me" />
    </Headcard>
  );
};

export default introCard;
