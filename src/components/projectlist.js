import PopGif from '../files/popgif.gif';
import TypingGif from '../files/typinggif.gif';
import LightGif from '../files/lightgif.gif';
import RedditGif from '../files/redditgif.gif';
import LPMGif from '../files/lpmgif.gif';

export const Projects = [
  {
    title: 'Lyrics Per Minute',
    languages: ['React', 'TypeScript', 'JavaScript', 'HTML', 'CSS'],
    description:
      'LPM is an isomorphic Next.js game where up to 5000 players, monthly, practice typing. The front end server-side renders from Netlify edge nodes, and the back end operates with AWS lambda and serverless MongoDB.',
    mediaSrc: LPMGif,
    imagealt: 'Gif of lyrics per minute',
    link: 'https://lyricsperminute.com',
  },
  {
    title: 'Reddit app',
    languages: ['React', 'TypeScript', 'JavaScript', 'HTML', 'CSS'],
    description:
      'A minor recreation of the social media app, Reddit, the front page of the internet. This project was a great way for me to practice REST API and global state management for efficiency and cleanliness.',
    mediaSrc: RedditGif,
    imagealt: 'Gif of reddit app',
    link: 'https://clinquant-cassata-762567.netlify.app/',
  },
  {
    title: 'Pop',
    languages: ['Unity', 'Csharp'],
    description:
      'A Unity based web game I produced with my 2 brothers. A peaceful top-down shooter which synchronizes the enemy waves with its music track.',
    mediaSrc: PopGif,
    imagealt: 'Gif of pop',
    link: 'https://gage-langdon.com/pop/',
  },
  {
    title: 'Vocabulary Typing Test',
    languages: ['JavaScript', 'HTML', 'CSS'],
    description:
      'Vocabulary Typing Test is a typing test that can help anyone improve their typing speed and develop their vocabulary. The app calls a dictionary API to create the set text the user types. After each term, the netWPM and average netWPM update, giving real time data on your performance.',
    mediaSrc: TypingGif,
    imagealt: 'Gif of vocabulary typing test',
    link: 'https://shimmering-dolphin-d470cd.netlify.app/',
  },
  {
    title: 'Light Sight',
    languages: ['JavaScript', 'HTML', 'CSS'],
    description:
      'Light Sight is a react app with various colored buttons that change the background of the page enabling the user to illuminate their face and surrounding environment with the color of their choosing.',
    mediaSrc: LightGif,
    imagealt: 'Gif of light sight',
    link: 'https://master--lightsight.netlify.app/',
  },
];
