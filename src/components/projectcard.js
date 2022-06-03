import styled from "styled-components";

const Card = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  color: white;
  border: 4px solid grey;
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 20px;
`;

const Appinfo = styled.div`
  margin: 5px;
  padding: 5px;
  line-height: 1.7;
`;

const Title = styled.a`
  margin: 3px;
  font-size: 1.5em;
  color: inherit;
`;

const Langs = styled.div`
  margin: 3px;
`;

const Description = styled.div`
  margin: 3px;
  line-height: 1.2;
`;

function projectcard(props) {
  return (
    <>
      <Card>
        <img
          src={props.imagesrc}
          alt={props.imagealt}
          width="100%"
          height="auto"
        />
        <Appinfo>
          <Title target="_blank" href={props.link}>
            {props.title}
          </Title>
          <Langs>{props.languages}</Langs>
          <Description>{props.description} </Description>
        </Appinfo>
      </Card>
    </>
  );
}

export default projectcard;
