import React from "react";
import styled from "styled-components";

const LanguagesContainer = styled.div`
  display: flex;
  background-color: inherit;
  font-size: 70%;
`;

const Card = styled.div`
  margin: 5px;
  background-color: #5a5a5a;
  font-size: 120%;
  display: flex;
  border: grey solid 1px;
  border-radius: 6px;
  padding: 5px;
`;

export default function TechCard({ languages }) {
  //   const [boxes, setBoxes] = useState([]);
  console.log(languages);
  const box = (
    <LanguagesContainer>
      {languages.map((lang, key) => {
        return <Card key={key}>{lang}</Card>;
      })}
    </LanguagesContainer>
  );

  return box;
}
