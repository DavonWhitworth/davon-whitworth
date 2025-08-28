import styled from 'styled-components';
import { motion } from 'framer-motion';

const Banner = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  background-color: #333333;
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  overflow: hidden;
  z-index: 1000;
`;

const Bannertext = styled(motion.div)`
  font-size: 1.1em;
  color: white;
  background-color: inherit;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 20px;
`;

const LinkedInbutton = styled.a`
  color: inherit;
  background-color: #435594;
  display: inline-block;
  border-radius: 4px;
  padding: 6px 12px;
  text-decoration: none;
  white-space: nowrap;
`;

const Headbanner = () => {
  return (
    <Banner>
      <Bannertext
        initial={{ x: '0%' }}
        animate={{ x: '-50%' }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        Looking for an Entry Level Frontend Engineer position in the Sacramento
        region or remote
        <LinkedInbutton
          target="_blank"
          href="https://www.linkedin.com/in/davon-whitworth-317b301a9/"
        >
          <i className="fa-brands fa-linkedin"></i>
          Contact me on LinkedIn
        </LinkedInbutton>
        Looking for an Entry Level Frontend Engineer position in the Sacramento
        region or remote
        <LinkedInbutton
          target="_blank"
          href="https://www.linkedin.com/in/davon-whitworth-317b301a9/"
        >
          <i className="fa-brands fa-linkedin"></i>
          Contact me on LinkedIn
        </LinkedInbutton>
      </Bannertext>
    </Banner>
  );
};

export default Headbanner;
