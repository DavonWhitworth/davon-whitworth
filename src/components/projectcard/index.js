import styled from "styled-components";
import React from "react";
import ReactPlayer from 'react-player'

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
  font-family: "Calibri";
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
  max-width: 400px;
  width: 100%;
`;

const Projectmedia = styled.div`
max-width: 400px;
width: 100%;
`



function projectcard({description, languages, title, mediaSrc, media_hint, link,imagealt}) {
  return (
    <>
      <Card>
        {media_hint === "image" ? (<Projectimg src={mediaSrc} alt={imagealt} />) : (<Projectmedia><ReactPlayer playing={true} controls={false} url="https://youtube.com/shorts/PMgS1iq8gXk?feature=share" loop={true} width="100%"/></Projectmedia>)}
        

        <Appinfo>
          <Title target="_blank" href={link}>
            {title}
          </Title>
          <Langs>{languages}</Langs>
          <Description>{description} </Description>
        </Appinfo>
      </Card>
    </>
  );
}

export default projectcard;
