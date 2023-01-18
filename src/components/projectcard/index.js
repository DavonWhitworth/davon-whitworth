import styled from "styled-components";
import React from "react";
import YouTube from "react-youtube";

const Card = styled.div`
  color: white;
  border-radius: 10px;
  padding: 5px;
  margin: 5px;
  margin-bottom: 10px;
  max-width: 1024px;
  min-width: fit-content;
  width: auto;
  display: flex;
  flex-wrap: wrap;
  background-color: inherit;
  font-family: sans-serif;
  width: 100%;
  max-width: 500px;
`;

const Appinfo = styled.div`
  margin: 5px;
  padding: 5px;
  line-height: 1.7;
  max-width: 530px;
  width: 100%;
  background-color: inherit;
  @media (min-width: 1000) {
    width: 400px;
  }
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
  width: 100%;
  background-color: inherit;
  font-size: 110%;
`;

const Projectimg = styled.img``;

const Projectmedia = styled.div`
  max-width: 400px;
  width: 100%;
`;

function projectcard({
  description,
  languages,
  title,
  mediaSrc,
  media_hint,
  link,
  imagealt,
}) {
  const videoOptions = {
    playerVars: {
      loop: 1,
      autoplay: 1,
      controls: 0,
      rel: 0,
      showinfo: 0,
      mute: 1,
    },
    playlist: { mediaSrc },
    height: "390",
    width: "100%",
  };
  return (
    <>
      <Card>
        {media_hint === "image" ? (
          <Projectmedia>
            <Projectimg src={mediaSrc} alt={imagealt} />
          </Projectmedia>
        ) : (
          <Projectmedia>
            <YouTube videoId={mediaSrc} opts={videoOptions} loop={true} />
          </Projectmedia>
        )}

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
