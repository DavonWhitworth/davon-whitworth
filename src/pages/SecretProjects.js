import {
  secretProjects,
  secretProjectsPageText,
} from '../components/secretprojectlist';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectCard from '../components/projectcard';
import styled from 'styled-components';
import NavBar from '../components/navBar';

const SecretProjectsHeader = styled.div`
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.5em;
  font-weight: bold;
  text-align: center;
  margin: 20px auto;
  padding: 10px;
  border-radius: 5px;
  width: fit-content;
  max-width: 600px;
  margin: 100px auto;
`;

const CardAnimation = () => {
  const [bodyVisible, setBodyVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setBodyVisible(true);
    }, 900);
  }, []);

  // Create content array with contact info and projects
  const contentToShow = [
    ...secretProjects.map((project, index) => ({
      type: 'project',
      component: ProjectCard,
      props: project,
      delay: (index + 1) * 0.3,
    })),
  ];

  return (
    <>
      <NavBar />
      <div>
        <SecretProjectsHeader>
          {secretProjectsPageText.introduction}
        </SecretProjectsHeader>
        <AnimatePresence initial={false}>
          {bodyVisible && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.8 }}
            >
              {contentToShow.map((item, index) => (
                <motion.div
                  key={`${item.type}-${index}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6 + index * 0.2,
                    delay: item.delay,
                    ease: 'easeOut',
                  }}
                >
                  <ProjectCard
                    title={item.props.title}
                    languages={item.props.languages}
                    description={item.props.description}
                    mediaSrc={item.props.mediaSrc}
                    imagealt={item.props.imagealt}
                    url={item.props.url}
                    page={item.props.page}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default CardAnimation;
