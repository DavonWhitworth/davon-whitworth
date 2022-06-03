import styled from "styled-components";

const Banner = styled.div`
  box-sizing: border-box;
  background-color: #add8e6;
  color: black;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  width: 100%;
  height: 23px;
  justify-content: center;
`;

const Header = () => {
  <Banner>
    I am looking for a junior frontend developer position, please contact me on
    my
    <a href="https://www.linkedin.com/in/davon-whitworth-317b301a9/">
      LinkedIn
    </a>
  </Banner>;
};

export default Header;
