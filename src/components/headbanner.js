import styled from "styled-components";
import { LinkedinLogo } from "phosphor-react";

const Banner = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  background-color: #112340;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
`;

const Bannertext = styled.div`
  font-size: 1.3em;
  color: white;
  justify-content: center;
  background-color: inherit;
  width: auto;
  align-items: center;
`;

const LinkedInbutton = styled.a`
  color: inherit;
  width: auto;
  background-color: orange;
  display: inline-block;
  border-radius: 4px;
  margin: 3px;
  padding: 2px;
`;

const Headbanner = () => {
  return (
    <Banner>
      <Bannertext>
        I am looking for a Junior developer position in the Sacramento region or
        remote PST
        <LinkedInbutton
          target="_blank"
          href="https://www.linkedin.com/in/davon-whitworth-317b301a9/"
        >
          <LinkedinLogo />
          Please contact me on LinkedIn
        </LinkedInbutton>
      </Bannertext>
    </Banner>
  );
};

export default Headbanner;
