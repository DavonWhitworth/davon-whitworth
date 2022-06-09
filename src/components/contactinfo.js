import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";

const Infoblock = styled.div`
  width: auto;
  background-color: #121111;
  color: white;
  border-radius: 9px;
  padding: 15px;
  margin-bottom: 15px;
  line-height: 2;
  display: inline-block;
`;

const Linkredirect = styled.a`
  color: inherit;
  padding: 5px;
  background-color: #121111;
`;

const Info = styled.div`
  color: inherit;
  background-color: #121111;
  padding: 5px;
`;

const contactInfo = () => {
  return (
    <Infoblock>
      <Info>Sacramento, Ca</Info>
      <Linkredirect
        target="_blank"
        href="https://www.linkedin.com/in/davon-whitworth-317b301a9/"
      >
        <FontAwesomeIcon
          icon={faDiscord}
          color="white"
          size="2x"
          position="fixed"
        />
        LinkedIn
      </Linkredirect>
      <Info>I Be Dog#0111</Info>
    </Infoblock>
  );
};

export default contactInfo;
