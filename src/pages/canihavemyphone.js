import React from 'react';
import styled from 'styled-components';

import NavBar from '../components/navBar';
import kelpForest from '../files/kelp_forest.jpg';
import limpetShell from '../files/limpetShell.png';

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  background-image: url(${kelpForest});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

const Title = styled.h2`
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  color: white;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 10px 20px;
  border-radius: 8px;
  margin: 0;
  z-index: 1;
`;

const Limpet = styled.img`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 160px;
  max-width: 40vw;
  height: auto;
  cursor: pointer;
  z-index: 2;
  transition:
    filter 200ms ease,
    transform 200ms ease;
  &:hover {
    filter: drop-shadow(0 0 12px rgba(255, 255, 255, 0.9));
  }
`;

export default function CanIHaveMyPhone() {
  return (
    <>
      <NavBar />
      <ImageContainer>
        <Title>Ask the Magic Conch if you can have your phone</Title>
        <Limpet
          src={limpetShell}
          alt="limpet shell"
          onClick={() => console.log('Limpet clicked')}
        />
      </ImageContainer>
    </>
  );
}
