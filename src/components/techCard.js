import React from 'react';
import styled from 'styled-components';
import {
  FaReact,
  FaJs,
  FaJava,
  FaHtml5,
  FaCss3Alt,
  FaNodeJs,
  FaUnity,
} from 'react-icons/fa';
import {
  SiTypescript,
  SiMongodb,
  SiVite,
  SiNextdotjs,
  SiCypress,
  SiGraphql,
  SiAmazon,
} from 'react-icons/si';
import { Tooltip } from 'react-tooltip';
import CSharpIcon from '../files/Csharp_Logo.png';

const ICON_SIZE = '1em';

const LanguagesContainer = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;
  background-color: transparent;
`;

const Card = styled.span`
  font-size: clamp(20px, 2.5vw, 30px);
  background-color: transparent;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  background-color: transparent;

  & svg,
  & img {
    background-color: transparent;
  }
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
  nodejs: <FaNodeJs size={ICON_SIZE} color="#339933" />,
  mongodb: <SiMongodb size={ICON_SIZE} color="#4DB33D" />,
  unity: <FaUnity size={ICON_SIZE} color="grey" />,
  csharp: <CSharpIconWrapper src={CSharpIcon} alt="C#" />,
  vite: <SiVite size={ICON_SIZE} color="#646CFF" />,
  nextjs: <SiNextdotjs size={ICON_SIZE} color="#000000" />,
  cypress: <SiCypress size={ICON_SIZE} color="#00BFA5" />,
  graphql: <SiGraphql size={ICON_SIZE} color="#E535AB" />,
  aws: <SiAmazon size={ICON_SIZE} color="#FF9900" />,
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
