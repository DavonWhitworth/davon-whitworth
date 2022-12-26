import styled from "styled-components";
import React from "react";
import LanguageBox from "./techCard"

const Card = styled.div`
  color: white;
  border-radius: 10px;
  padding: 5px;
  margin: 5px;
  max-width: 1024px;
  min-width: fit-content;
  width: auto;
  display: flex;
  flex-wrap: wrap;
  background-color: inherit;
`;

const Appinfo = styled.div`
  margin: 5px;
  padding: 5px;
  line-height: 1.7;
  max-width: 530px;
  width: 100%;
  background-color: inherit;
`;

const Title = styled.a`
  margin: 3px;
  font-size: 1.5em;
  color: inherit;
  background-color: inherit;
`;

const Langs = styled.div`
  margin: 3px;
  background-color: inherit;
  font-size: 120%;
`;

const Description = styled.div`
  margin: 3px;
  line-height: 1.2;
  width: auto;
  background-color: inherit;
  font-size: 110%;
`;

const Projectimg = styled.img`
  max-width: 375px;
  width: 100%;
`;

function projectcard(props) {
  return (
    <>
      <Card>
        <Projectimg src={props.imagesrc} alt={props.imagealt} />

        <Appinfo>
          <Title target="_blank" href={props.link}>
            {props.title}
          </Title>
          <LanguageBox>{props.languages}</LanguageBox>
          <Description>{props.description} </Description>
        </Appinfo>
      </Card>
    </>
  );
}

export default projectcard;
