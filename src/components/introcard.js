import styled from 'styled-components';
import { AnimatePresence, motion } from 'motion/react';
import PortaitJPG from '../files/Portrait.jpg';
import LookingForWorkRing from '../files/LookingForWork.png';

const Headcard = styled.div`
  width: 100%;
  min-width: 300px;
  max-width: 1024px;
  font-family: 'HELVETICA';
  display: flex;
  align-items: flex-end;
  flex-wrap: wrap;
  justify-content: center;
  align-self: center;
  gap: 15px;
  margin: 100px auto;
`;

const Infodiv = styled.div`
  color: white;
  grid-column-start: 2;
  flex-wrap: nowrap;
  text-align: center;
  transform: translateY(-12px);
`;

const Titlediv = styled.h3`
  color: rgba(255, 255, 255, 0.9);
`;

const Namediv = styled.h1`
  font-size: 3em;
`;

const PortaitImg = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  position: relative;
  z-index: 1000;
  object-fit: cover;
`;

// Wrapper to overlay the ring image around the portrait
const PortraitWrapper = styled.div`
  position: relative;
  width: min(40vw, 250px);
  aspect-ratio: 1 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// Make the styled image motion-capable
const MotionPortraitImg = motion.create(PortaitImg);

const introCard = ({ infoVisible }) => {
  return (
    <AnimatePresence initial={false} animate={{ transition: { duration: 1 } }}>
      {infoVisible && (
        <Headcard>
          <PortraitWrapper>
            {/* Rotating ring overlay */}
            <motion.img
              src={LookingForWorkRing}
              alt="Rotating ring"
              style={{
                position: 'absolute',
                inset: '-14.1%',
                width: '128%',
                height: '128%',
                pointerEvents: 'none',
                zIndex: 0,
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 16, ease: 'linear', repeat: Infinity }}
            />
            {/* Portrait image */}
            <MotionPortraitImg
              src={PortaitJPG}
              alt="Portrait"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 1 }}
              style={{ width: '70%', height: '70%', display: 'block' }}
            />
          </PortraitWrapper>
          <Infodiv>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 1 }}
            >
              <Namediv>Davon Whitworth</Namediv>
              <Titlediv>Full-Stack Web Developer</Titlediv>
            </motion.div>
          </Infodiv>
        </Headcard>
      )}
    </AnimatePresence>
  );
};

export default introCard;
