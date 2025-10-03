import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// import Banner from './components/headbanner';
import ProjectCard from '../components/projectcard';
import IntroCard from '../components/introcard';
import ContactInfo from '../components/contactinfo';
import { Projects } from '../components/projectlist';

const HomePage = () => {
  const [infoVisible, setInfoVisible] = useState(false);
  const [bodyVisible, setBodyVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setInfoVisible(true);
    }, 400);
    setTimeout(() => {
      setBodyVisible(true);
    }, 1100);
  }, []);

  // Create content array with contact info and projects
  const contentToShow = [
    { type: 'contact', component: ContactInfo, delay: 0 },
    ...Projects.map((project, index) => ({
      type: 'project',
      component: ProjectCard,
      props: project,
      delay: (index + 1) * 0.3,
    })),
  ];

  return (
    <>
      <div>
        <IntroCard infoVisible={infoVisible} />

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
                  {item.type === 'contact' ? (
                    <ContactInfo />
                  ) : (
                    <ProjectCard
                      title={item.props.title}
                      languages={item.props.languages}
                      description={item.props.description}
                      mediaSrc={item.props.mediaSrc}
                      imagealt={item.props.imagealt}
                      url={item.props.url}
                      page={item.props.page}
                    />
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default HomePage;
