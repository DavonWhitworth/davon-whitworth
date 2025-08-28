import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import './App.css';
import IntroCard from './components/introcard';
import Banner from './components/headbanner';
import Contactinfo from './components/contactinfo';
import Projectcard from './components/projectcard';
import { Projects } from './components/projectlist';

const App = () => {
  const [headerVisible, setHeaderVisible] = useState(false);
  const [bodyVisible, setBodyVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setHeaderVisible(true);
    }, 1000);
    setTimeout(() => {
      setBodyVisible(true);
    }, 2000);
  }, []);

  // Create content array with contact info and projects
  const contentToShow = [
    { type: 'contact', component: Contactinfo, delay: 0 },
    ...Projects.map((project, index) => ({
      type: 'project',
      component: Projectcard,
      props: project,
      delay: (index + 1) * 0.3, // Increasing delay for each project
    })),
  ];

  return (
    <>
      <Banner />
      <div className="pagediv">
        <IntroCard headerVisible={headerVisible} />

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
                    duration: 0.6 + index * 0.2, // Increasing duration for each item
                    delay: item.delay,
                    ease: 'easeOut',
                  }}
                >
                  {item.type === 'contact' ? (
                    <Contactinfo />
                  ) : (
                    <Projectcard
                      title={item.props.title}
                      languages={item.props.languages}
                      description={item.props.description}
                      mediaSrc={item.props.mediaSrc}
                      imagealt={item.props.imagealt}
                      link={item.props.link}
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

export default App;
