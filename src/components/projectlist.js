import Projectcard from "./projectcard";
import styled from "styled-components";
// import Poppicture from "../projectpics/Poppic.PNG";
// import Typingtestpicture from "../projectpics/typingtestpic.PNG";
// import Lightsitepicture from "../projectpics/lightsitepic.PNG";

const Projectblock = styled.div`
  padding: 5px 20px;
  background-color: #171717;
  margin: 5px auto;
  border-radius: 6px;
  width: fit-content;
  max-width: 1024px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Listheader = styled.h1`
  background-color: inherit;
  color: white;
  margin-left: 3%;
`;
//using youtube react, only need youtube id for videos
const Projectlist = () => {
  return (
    <Projectblock>
      <Listheader>Hobby Projects</Listheader>
      <Projectcard
        title="Lyrics Per Minute"
        languages={"React"}
        description="LPM is an isomorphic Next.js game where 350 daily players practice typing. The front end server-side renders from Netlify edge nodes, and the back end operates with AWS lambda and serverless MongoDB."
        mediaSrc="WdKdY0Xi0TI"
        imagealt="Gif of reddit app"
        link="https://lyricsperminute.com"
        media_hint="video"
      />
      <Projectcard
        title="Reddit app"
        languages={"React"}
        description="A minor recreation of the social media app, Reddit. An easy way to access the front page of the internet "
        mediaSrc="PMgS1iq8gXk"
        imagealt="Gif of reddit app"
        link="https://clinquant-cassata-762567.netlify.app/"
        media_hint="video"
      />
      <Projectcard
        title="Pop"
        languages={"Unity"}
        description="A web game I produced with my 2 brothers. A peacful top-down shooter which synchronizes the enemy waves with it's music track."
        mediaSrc="YSOAt9GS_Lo"
        imagealt="Pop picture"
        link="https://gage-langdon.com/pop/"
        media_hint="video"
      />
      <Projectcard
        title="Vocabulary Typing Test"
        languages={"React"}
        description="Vocabulary Typing Test is a typing test that can help anyone improve their typing speed and develop their vocabulary. The app calls a dictionary API to create the set text the user types. After each term, the netWPM and average netWPM update, giving real time data on your performance."
        mediaSrc="XVNdyOYV6Qg"
        imagealt="Vocabulary typing test picture"
        media_hint="video"
      />
      <Projectcard
        title="Light Sight"
        languages={"React"}
        description="Light Sight is a react app with various colored buttons that change the background of the page enabling the user to illuminate their face and surrounding environment with the color of their choosing."
        mediaSrc="9n9yt1qJYSg"
        imagealt="Light sight picture"
        link="https://master--lightsight.netlify.app/"
        media_hint="video"
      />
    </Projectblock>
  );
};

export default Projectlist;
