import styled from "styled-components";

const Banner = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  background-color: #333333;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  text-align: center;
`;

const Bannertext = styled.div`
  font-size: 1.1em;
  color: white;
  justify-content: center;
  background-color: inherit;
  width: auto;
  align-items: center;
  margin-top: 5px;
  margin-bottom: 5px;
`;

const LinkedInbutton = styled.a`
  color: inherit;
  width: auto;
  background-color: #435594;
  display: inline-block;
  border-radius: 4px;
  margin: 3px;
  margin-left: 8px;
  padding: 6px;
  text-decoration: none;
`;

const Headbanner = () => {
  return (
    <Banner>
      <Bannertext>
        I am looking for an Entry Level Junior Software Engineer position in the Sacramento
        region or remote PST
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
