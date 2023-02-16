import React from "react";
import styled from "styled-components";

const LanguagesContainer = styled.div`
  display: flex;
  background-color: inherit;
 
`;

const Card = styled.div`
  margin: 5px;
  background-color: #4C4E52DE;
  font-size: 90%;
  display: flex;
  border: grey solid 1px;
  border-radius: 6px;
  padding: 5px;
`;

export default function TechCard({ languages }) {
  const box = (
    <LanguagesContainer>
      {languages.map((lang, key) => {
        return <Card key={key}>{lang}</Card>;
      })}
    </LanguagesContainer>
  );

  return box;
}
