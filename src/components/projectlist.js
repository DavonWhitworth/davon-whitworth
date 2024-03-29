import Projectcard from "./projectcard";
import styled from "styled-components";
import PopGif from "../files/popgif.gif";
import TypingGif from "../files/typinggif.gif";
import LightGif from "../files/lightgif.gif";
import RedditGif from "../files/redditgif.gif";
import LPMGif from "../files/lpmgif.gif";

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
        languages={["TypeScript", "JavaScript", "HTML", "CSS"]}
        description="LPM is an isomorphic Next.js game where up to 5000 players, monthly, practice typing. The front end server-side renders from Netlify edge nodes, and the back end operates with AWS lambda and serverless MongoDB."
        mediaSrc={LPMGif}
        imagealt="Gif of reddit app"
        link="https://lyricsperminute.com"
      />
      <Projectcard
        title="Reddit app"
        languages={["TypeScript", "JavaScript", "HTML", "CSS"]}
        description="A minor recreation of the social media app, Reddit, the front page of the internet. This project was a great way for me to practice REST API and global state management for efficiency and cleanliness."
        mediaSrc={RedditGif}
        imagealt="Gif of reddit app"
        link="https://clinquant-cassata-762567.netlify.app/"
      />
      <Projectcard
        title="Pop"
        languages={["C#"]}
        description="A web game I produced with my 2 brothers. A peaceful top-down shooter which synchronizes the enemy waves with its music track."
        mediaSrc={PopGif}
        imagealt="Pop picture"
        link="https://gage-langdon.com/pop/"
      />
      <Projectcard
        title="Vocabulary Typing Test"
        languages={["JavaScript", "HTML", "CSS"]}
        description="Vocabulary Typing Test is a typing test that can help anyone improve their typing speed and develop their vocabulary. The app calls a dictionary API to create the set text the user types. After each term, the netWPM and average netWPM update, giving real time data on your performance."
        mediaSrc={TypingGif}
        link="https://shimmering-dolphin-d470cd.netlify.app/"
        imagealt="Vocabulary typing test picture"
      />
      <Projectcard
        title="Light Sight"
        languages={["JavaScript", "HTML", "CSS"]}
        description="Light Sight is a react app with various colored buttons that change the background of the page enabling the user to illuminate their face and surrounding environment with the color of their choosing."
        mediaSrc={LightGif}
        imagealt="Light sight picture"
        link="https://master--lightsight.netlify.app/"
      />
    </Projectblock>
  );
};

export default Projectlist;
