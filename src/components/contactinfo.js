import styled from "styled-components";
import { House, LinkedinLogo, DiscordLogo } from "phosphor-react";

const Infoblock = styled.div`
  width: 72%;
  background-color: #121111;
  color: white;
  border-radius: 20px;
  padding: 15px;
  margin-bottom: 15px;
  line-height: 2;
`;

const Linkredirect = styled.a`
  color: inherit;
  padding: 5px;
`;

const Info = styled.div`
  color: inherit;
  background-color: #121111;
  padding: 5px;
`;

const contactInfo = () => {
  return (
    <Infoblock>
      <Info>
        <House size={24} />
        Sacramento, California
      </Info>
      <Linkredirect
        target="_blank"
        href="https://www.linkedin.com/in/davon-whitworth-317b301a9/"
      >
        <LinkedinLogo size={24} />
        LinkedIn
      </Linkredirect>
      <Info>
        <DiscordLogo size={24} />I Be Dog#0111
      </Info>
    </Infoblock>
  );
};

export default contactInfo;
