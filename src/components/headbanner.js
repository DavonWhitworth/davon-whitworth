import styled from "styled-components";
import { LinkedinLogo } from "phosphor-react";
import { Button } from "@chakra-ui/react";

const Banner = styled.div`
  position: sticky;
  top: 0;

  background-color: #112340;
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Bannertext = styled.div`
  font-size: 1.3em;
  color: white;
  justify-content: center;
  background-color: inherit;
`;

const Headbanner = () => {
  return (
    <Banner>
      <Bannertext>
        I am looking for a Junior developer position in the Sacramento region or
        remote PST
        <Button colorScheme="teal" size="lg">
          Please contact me on LinkedIn
        </Button>
      </Bannertext>
    </Banner>
  );
};

export default Headbanner;
