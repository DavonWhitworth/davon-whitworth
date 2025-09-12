import PopGif from '../files/popgif.gif';
import TypingGif from '../files/typinggif.gif';
import LightGif from '../files/lightgif.gif';
import RedditGif from '../files/redditgif.gif';
import LPMGif from '../files/lpmgif.gif';
import KBJewelsImg from '../files/kbjewels.png';
import notavailable from '../files/notavailable.jpg';
import StudioVaultImg from '../files/studiovaultbeta.png';
import TwoDRunnerImg from '../files/2Drunner.png';

export const Projects = [
  {
    title: 'Studio Vault',
    languages: [
      'React',
      'TypeScript',
      'JavaScript',
      'HTML',
      'CSS',
      'cypress',
      'MongoDB',
      'AWS',
    ],
    description:
      'A collaborative file management platform designed specifically for music producers and audio engineers. The application enables users to upload, share, and synchronize Digital Audio Workstation (DAW) project files across different platforms and team members. It supports major DAW formats including Ableton Live, Logic Pro, Pro Tools, Cubase, FL Studio, REAPER, and Studio One, along with associated project assets like audio samples, backup files, and project metadata.',
    mediaSrc: StudioVaultImg,
    imagealt: 'Gif of studio vault',
    url: 'https://studiovaultbeta.com/',
    status: 'beta',
    page: undefined,
  },

  {
    title: 'Lyrics Per Minute',
    languages: [
      'React',
      'TypeScript',
      'JavaScript',
      'HTML',
      'CSS',
      'MongoDB',
      'nodejs',
    ],
    description:
      'LPM was an isomorphic Next.js typing game, server-rendered from Netlify edge nodes with an AWS Lambda + MongoDB backend. After 1.4M matches and 68K players since March 2020, the app closed on March 31, 2025 due to rising hosting costs. ',
    mediaSrc: LPMGif,
    imagealt: 'Gif of lyrics per minute',
    url: 'https://lyricsperminute.com',
    status: 'closed',
    page: undefined, //'/lyricsperminute'
  },
  {
    title: 'KB Jewels',
    languages: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'HTML5', 'CSS'],
    description:
      'A modern, responsive website for KB Jewels, a premium custom jeweler with an international clientele. Built with Next.js 15, TypeScript, and Material-UI, it features elegant animations, reCAPTCHA-protected contact forms, and SEO optimization to showcase bespoke collections with a luxury brand aesthetic.',
    mediaSrc: KBJewelsImg,
    imagealt: 'Gif of studio vault',
    url: 'https://kb-jewels.com/',
    status: 'live',
    page: undefined,
  },
  {
    title: 'Player Club Managment',
    languages: [
      'React',
      'Vite',
      'TypeScript',
      'JavaScript',
      'HTML5',
      'CSS',
      'MongoDB',
    ],
    description:
      'Final project for a web development course: a responsive website for a local agency entering the NIL athlete space. Built features for creating custom athlete profiles and tools to connect athletes with potential sponsors.',
    mediaSrc: notavailable,
    imagealt: 'Gif of studio vault',
    url: undefined,
    status: 'live',
    page: undefined,
  },
  {
    title: 'Reddit app',
    languages: ['React', 'TypeScript', 'JavaScript', 'HTML5', 'CSS'],
    description:
      'A lightweight Reddit client that fetches JSON data directly from subreddit URLs and dynamically renders posts. Built to practice REST API integration and global state management.',
    mediaSrc: RedditGif,
    imagealt: 'Gif of reddit app',
    url: 'https://clinquant-cassata-762567.netlify.app/',
    status: 'live',
    page: undefined,
  },
  {
    title: 'Pop',
    languages: ['Unity', 'Csharp'],
    description:
      'A Unity web game created with my brothers, blending a peaceful top-down shooter style with enemy waves that follow the rhythm of its soundtrack.',
    mediaSrc: PopGif,
    imagealt: 'Gif of pop',
    url: 'https://gage-langdon.com/pop/',
    status: 'live',
    page: undefined,
  },
  {
    title: '2D Runner',
    languages: ['Unity', 'Csharp'],
    description:
      'My first Unity project: a 2D runner with moving obstacles, enemies, boundaries, and a finish line. A beginner-friendly game where I learned C# scripting and Unity animations.',
    mediaSrc: TwoDRunnerImg,
    imagealt: 'Gif of 2d runner',
    url: 'https://davon-whitworth.com/2d-runner/',
    status: 'live',
    page: undefined,
  },
  {
    title: 'Vocabulary Typing Test',
    languages: ['JavaScript', 'HTML5', 'CSS'],
    description:
      'A typing practice app that generates text from a dictionary API, helping users improve speed and vocabulary. Tracks net WPM and averages in real time after each word.',
    mediaSrc: TypingGif,
    imagealt: 'Gif of vocabulary typing test',
    url: 'https://shimmering-dolphin-d470cd.netlify.app/',
    status: 'live',
    page: undefined,
  },
  {
    title: 'Light Sight',
    languages: ['JavaScript', 'HTML5', 'CSS'],
    description:
      'A web app with color controls that change the background, letting users illuminate their space with the hue of their choice.',
    mediaSrc: LightGif,
    imagealt: 'Gif of light sight',
    url: 'https://master--lightsight.netlify.app/',
    status: 'live',
    page: undefined,
  },
];
