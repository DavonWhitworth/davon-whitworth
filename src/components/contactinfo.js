import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHomeLg } from "@fortawesome/free-solid-svg-icons";
import {
  faDiscord,
  faLinkedin,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";

const Infoblock = styled.div`
  width: fit-content;
  max-width: 220px;
  background-color: #171717;
  color: white;
  border-radius: 6px;
  padding: 15px;
  margin: 15px auto 15px auto;
  line-height: 1.5;
  align-self: center;
  display: flex;
  flex-wrap: wrap;
  font-size: 130%;
`;

const Linkredirect = styled.a`
  color: inherit;
  padding: 5px;
  background-color: inherit;
`;

const Info = styled.div`
  color: inherit;
  background-color: inherit;
  padding: 5px;
  text-align: left;
`;

const contactInfo = () => {
  return (
    <Infoblock>
      <Info>
        <FontAwesomeIcon
          icon={faHomeLg}
          color="white"
          size="1x"
          position="fixed"
        />
        &nbsp;&nbsp; Sacramento, Ca
      </Info>
      <Info>
        <FontAwesomeIcon
          icon={faLinkedin}
          color="white"
          size="1x"
          position="fixed"
        />
        &nbsp;&nbsp;&nbsp;
        <Linkredirect
          target="_blank"
          href="https://www.linkedin.com/in/davon-whitworth-317b301a9/"
        >
          LinkedIn
        </Linkredirect>
      </Info>
      <Info>
        <FontAwesomeIcon
          icon={faGithub}
          color="white"
          size="1x"
          position="fixed"
        />
        &nbsp;&nbsp;&nbsp;
        <Linkredirect target="_blank" href="https://github.com/DavonWhitworth">
          GitHub
        </Linkredirect>
      </Info>
      <Info>
        <FontAwesomeIcon
          icon={faDiscord}
          color="white"
          size="1x"
          position="fixed"
          enableBackground={"inherit"}
        />
        &nbsp;&nbsp; I Be Dog#0111
      </Info>
    </Infoblock>
  );
};

export default contactInfo;
