import styled from "styled-components";
import React from "react";
import TechCard from "../techCard";

const Card = styled.div`
  color: white;
  border-radius: 10px;
  padding: 5px;
  margin-top: 10px;
  margin-bottom: 20px;
  max-width: 1024px;
  min-width: fit-content;
  width: auto;
  display: flex;
  flex-wrap: wrap;
  background-color: inherit;
  font-family: "Tahoma";
  width: 100%;

  max-width: 1000px;
  @media (max-width: 1010px) {
    width: auto;
    max-width: 350px;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 40px;
    padding: 12px;
    border: grey 0.1px solid;
  }
`;

const Appinfo = styled.div`
  margin: 5px;
  padding: 5px;
  line-height: 1.7;
  max-width: 530px;
  width: auto;
  background-color: inherit;
  @media (min-width: 1000px) {
    width: 400px;
  }
  @media (max-width: 1010px) {
    max-width: 350px;
  }
`;

const Title = styled.a`
  margin: 3px;
  font-size: 1.6em;
  color: #516ac4;
  background-color: inherit;
  text-decoration: none;
`;

const Description = styled.div`
  margin: 3px;
  line-height: 1.2;
  width: 100%;
  background-color: inherit;
  font-size: 110%;
  color: rgba(255, 255, 255, 0.8);
`;

const Projectimg = styled.img`
  max-width: 350px;
  width: 100%;
  border-radius: 10px;
`;

function projectcard({
  description,
  languages,
  title,
  mediaSrc,
  link,
  imagealt,
}) {
  return (
    <>
      <Card>
        <Projectimg src={mediaSrc} alt={imagealt} />

        <Appinfo>
          <Title target="_blank" href={link}>
            {title}
          </Title>
          <TechCard languages={languages} />
          <Description>{description} </Description>
        </Appinfo>
      </Card>
    </>
  );
}

export default projectcard;
