import React from 'react';
import styled from 'styled-components';
import {
  FaReact,
  FaJs,
  FaJava,
  FaHtml5,
  FaCss3Alt,
  FaNodeJs,
  FaGitAlt,
  FaGithub,
  FaUnity,
} from 'react-icons/fa';
import { SiTypescript, SiMongodb } from 'react-icons/si';
import { Tooltip } from 'react-tooltip';
import CSharpIcon from '../files/Csharp_Logo.png';

const LanguagesContainer = styled.div`
  display: flex;
  gap: 5px;
  font-size: 1.2em;
`;

const Card = styled.div`
  display: flex;
`;

const TechIcons = {
  react: <FaReact color="#61DBFB" />,
  javascript: <FaJs color="#F0DB4F" />,
  typescript: <SiTypescript color="#3178C6" />,
  java: <FaJava color="#007396" />,
  html5: <FaHtml5 color="#E34F26" />,
  css: <FaCss3Alt color="#1572B6" />,
  node: <FaNodeJs color="#339933" />,
  nodejs: <FaNodeJs color="#339933" />,
  mongodb: <SiMongodb color="#4DB33D" />,
  git: <FaGitAlt color="#F05032" />,
  github: <FaGithub color="#181717" />,
  unity: <FaUnity color="grey" />,
  csharp: (
    <img
      src={CSharpIcon}
      alt="C#"
      width="30px"
      height="30px"
      style={{ transform: 'translateY(-1px)' }}
    />
  ),
};

export default function TechCard({ languages }) {
  const box = (
    <LanguagesContainer>
      {languages.map((lang, key) => {
        const icon = TechIcons[lang.toLowerCase()];
        return (
          <Card key={key} data-tooltip-id={lang} data-tooltip-content={lang}>
            <Tooltip id={lang} place="bottom" />
            {icon && <span style={{ marginRight: '5px' }}>{icon}</span>}
          </Card>
        );
      })}
    </LanguagesContainer>
  );

  return box;
}
