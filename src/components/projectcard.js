import styled from "styled-components";

// import portfoliopic from "./src/projectpics/porfoliopic.PNG";
// <img src={portfoliopic} alt="Portfolio image" />;

const Card = styled.div`
  displaly: grid;
  color: white;
  border-color: white;
`;

const Title = styled.div`
  font-size: 24;
`;

const Langs = styled.div``;

const Description = styled.div``;
const ProjectLink = styled.link``;

function projectcard(props) {
  return (
    <>
      <Card>
        <Title href="google.com">{props.title}</Title>
        <Langs>{props.languages}</Langs>
        <Description>{props.description} </Description>
      </Card>
    </>
  );
}

export default projectcard;
