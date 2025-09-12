import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';

import './App.css';
import IntroCard from './components/introcard';
// import Banner from './components/headbanner';
import Contactinfo from './components/contactinfo';
import Projectcard from './components/projectcard';
import { Projects } from './components/projectlist';
import LyricsPerMinute from './pages/lyricsperminute';

const App = () => {
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
    { type: 'contact', component: Contactinfo, delay: 0 },
    ...Projects.map((project, index) => ({
      type: 'project',
      component: Projectcard,
      props: project,
      delay: (index + 1) * 0.3,
    })),
  ];

  return (
    <Router>
      <ScrollToTopOnRouteChange />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <div className="pagediv">
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
                            <Contactinfo />
                          ) : (
                            <Projectcard
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
          }
        />
        <Route path="/lyricsperminute" element={<LyricsPerMinute />} />
        {/* Add more routes as you create documentation pages */}
      </Routes>
    </Router>
  );
};

export default App;

// Scroll to top on every route change
function ScrollToTopOnRouteChange() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}
