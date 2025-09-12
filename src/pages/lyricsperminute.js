import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const DocumentationPage = styled.div`
  min-height: 100vh;
  background-color: #0a0a0a;
  color: white;
  padding: 20px;
  font-family: 'Tahoma', sans-serif;
`;

const BackButton = styled(Link)`
  display: inline-block;
  margin-bottom: 20px;
  padding: 10px 20px;
  background-color: #516ac4;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #3d5aa6;
  }
`;

const Title = styled.h1`
  color: #516ac4;
  margin-bottom: 20px;
`;

const Content = styled.div`
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.6;
`;

export default function LyricsPerMinute() {
  return (
    <DocumentationPage>
      <Content>
        <BackButton to="/">← Back to Portfolio</BackButton>
        <Title>Lyrics Per Minute - Documentation</Title>
        <p>
          LPM was an isomorphic Next.js typing game, server-rendered from
          Netlify edge nodes with an AWS Lambda + MongoDB backend. After 1.4M
          matches and 68K players since March 2020, the app closed on March 31,
          2025 due to rising hosting costs.
        </p>
        <h2>Technical Details</h2>
        <ul>
          <li>Built with Next.js and TypeScript</li>
          <li>Server-side rendering from Netlify edge nodes</li>
          <li>AWS Lambda backend with MongoDB database</li>
          <li>Real-time multiplayer functionality</li>
          <li>Responsive design for all devices</li>
        </ul>
        <h2>Features</h2>
        <ul>
          <li>Real-time typing competitions</li>
          <li>User statistics and leaderboards</li>
          <li>Custom song lyrics integration</li>
          <li>Social features and user profiles</li>
        </ul>
      </Content>
    </DocumentationPage>
  );
}
