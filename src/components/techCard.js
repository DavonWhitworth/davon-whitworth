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

// Single size constant for all icons
const ICON_SIZE = '1em';

const LanguagesContainer = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;
`;

const Card = styled.div`
  display: flex;
  align-items: center;
  font-size: clamp(20px, 2.5vw, 30px);
`;

const IconWrapper = styled.span`
  display: flex;
  align-items: center;
`;

const CSharpIconWrapper = styled.img`
  width: 1.5em;
  height: 1.5em;
  transform: translateY(-2px);
`;

const TechIcons = {
  react: <FaReact size={ICON_SIZE} color="#61DBFB" />,
  javascript: <FaJs size={ICON_SIZE} color="#F0DB4F" />,
  typescript: <SiTypescript size={ICON_SIZE} color="#3178C6" />,
  java: <FaJava size={ICON_SIZE} color="#007396" />,
  html5: <FaHtml5 size={ICON_SIZE} color="#E34F26" />,
  css: <FaCss3Alt size={ICON_SIZE} color="#1572B6" />,
  node: <FaNodeJs size={ICON_SIZE} color="#339933" />,
  nodejs: <FaNodeJs size={ICON_SIZE} color="#339933" />,
  mongodb: <SiMongodb size={ICON_SIZE} color="#4DB33D" />,
  git: <FaGitAlt size={ICON_SIZE} color="#F05032" />,
  github: <FaGithub size={ICON_SIZE} color="#181717" />,
  unity: <FaUnity size={ICON_SIZE} color="grey" />,
  csharp: <CSharpIconWrapper src={CSharpIcon} alt="C#" />,
};

export default function TechCard({ languages }) {
  return (
    <LanguagesContainer>
      {languages.map((lang, key) => {
        const icon = TechIcons[lang.toLowerCase()];
        return (
          <Card key={key} data-tooltip-id={lang} data-tooltip-content={lang}>
            <Tooltip
              id={lang}
              place="bottom"
              style={{
                fontSize: '0.7em',
                padding: '4px 8px',
                backgroundColor: '#333',
                color: 'white',
                borderRadius: '12px',
                zIndex: 1000,
              }}
            />
            {icon && <IconWrapper>{icon}</IconWrapper>}
          </Card>
        );
      })}
    </LanguagesContainer>
  );
}
