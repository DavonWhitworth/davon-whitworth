import styled from 'styled-components';
import { FaHome, FaLinkedin, FaGithub, FaDiscord } from 'react-icons/fa';
import BearIcon from '../files/CaFlagBear.png';
import { Tooltip } from 'react-tooltip';

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
        <FaHome color="#BD8A5E" size="1em" />
        &nbsp;&nbsp; Sacramento, Ca &nbsp;
        <img
          src={BearIcon}
          alt="Bear Icon"
          width="31px"
          data-tooltip-id="bear-icon"
          data-tooltip-content="It's a fake bear, don't pepper spray it!"
        />
        <Tooltip
          id="bear-icon"
          place="top"
          style={{
            fontSize: '0.8em',
            padding: '4px 8px',
            backgroundColor: '#333',
            color: 'white',
            borderRadius: '4px',
            zIndex: 1000,
          }}
        />
      </Info>
      <Info>
        <FaLinkedin color="#0a66c2" size="1em" />
        &nbsp;&nbsp;&nbsp;
        <Linkredirect
          target="_blank"
          href="https://www.linkedin.com/in/davon-whitworth-317b301a9/"
        >
          LinkedIn
        </Linkredirect>
      </Info>
      <Info>
        <FaGithub color="grey" size="1em" />
        &nbsp;&nbsp;&nbsp;
        <Linkredirect target="_blank" href="https://github.com/DavonWhitworth">
          GitHub
        </Linkredirect>
      </Info>
      <Info>
        <FaDiscord color="#7289da" size="1em" />
        &nbsp;&nbsp; I Be Dog
      </Info>
    </Infoblock>
  );
};

export default contactInfo;
