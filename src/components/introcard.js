import styled from 'styled-components';
import { AnimatePresence, motion } from 'motion/react';

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
`;

const Titlediv = styled.h3`
  color: rgba(255, 255, 255, 0.9);
`;

const Namediv = styled.h1`
  font-size: 3em;
`;

const introCard = ({ headerVisible }) => {
  return (
    <>
      <Headcard>
        <Infodiv>
          <AnimatePresence
            initial={false}
            animate={{ transition: { duration: 2 } }}
          >
            {headerVisible && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: 1 }}
              >
                <Namediv>Davon Whitworth</Namediv>
                <Titlediv>Frontend Software Engineer</Titlediv>
              </motion.div>
            )}
          </AnimatePresence>
        </Infodiv>
      </Headcard>
    </>
  );
};

export default introCard;
