---
title: Lyrics Per Minute
description: Lyrics Per Minute was a multiplayer typing game where players typed song lyrics and competed for the highest lyrics-per-minute score.
updated: "2026-11-13"
---

Lyrics Per Minute was a multiplayer typing game where players practiced typing song lyrics while competing to achieve the highest lyrics-per-minute score. Players could select songs, type along with the displayed lyrics, track speed and accuracy, view leaderboards and match history, create profiles, and compete in real-time multiplayer matches. The platform also supported public and private lobbies, player matchmaking, bots, song management, moderation tools, user profiles, and song links to services such as Spotify and YouTube.

The frontend was built with Next.js, React, and TypeScript, with Ant Design, Styled Components, and styled-system used for the interface and responsive layouts. The game used React context and custom hooks to manage song selection, keyboard input, countdowns, player progress, matches, authentication, and game state. The backend was a TypeScript and Node.js Express service deployed through the Serverless Framework on AWS Lambda and API Gateway. MongoDB stored users, songs, games, matches, and player statistics, while WebSockets enabled real-time multiplayer updates. AWS services were also used for S3 asset storage, CloudFront delivery, SES email, image moderation through Rekognition, and other supporting infrastructure. Automated testing included Jest and Cypress, with Netlify used for frontend deployment.

Before the project was shut down, it had recorded more than 1.4 million matches and 68,096 players since launching on March 1, 2020. The service officially ended on March 31, 2025, because hosting costs had grown too high for a free hobby project. The shutdown message thanked the community and recognized the project’s top players.
