import { useEffect } from 'react';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import './App.css';

//Primary Projects - Not Secret
import HomePage from './pages/HomePage';
// import LyricsPerMinute from './pages/lyricsperminute'; //Lyrics Per Minute

//Secondary Projects - "Secret"
import SecretProjects from './pages/SecretProjects';
import CanIHaveMyPhone from './pages/canihavemyphone'; //Can I Have My Phone

const App = () => {
  return (
    <Router>
      <ScrollToTopOnRouteChange />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/SecretProjects" element={<SecretProjects />} />
        <Route
          path="/SecretProjects/CanIHaveMyPhone"
          element={<CanIHaveMyPhone />}
        />
        {/* Add more routes as you create documentation pages */}
      </Routes>
    </Router>
  );
};

// Scroll to top on every route change
function ScrollToTopOnRouteChange() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

export default App;
