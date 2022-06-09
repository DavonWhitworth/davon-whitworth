import styled from "styled-components";

const Card = styled.div`
  color: white;
  border: 2px solid grey;
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 20px;
  width: auto;
  display: flex;
  flex-wrap: wrap;
  min-width: fit-content;
`;

const Appinfo = styled.div`
  margin: 5px;
  padding: 5px;
  line-height: 1.7;
  min-width: 160px;
  max-width: 500px;
  width: auto;
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

const Projectimg = styled.img`
  min-width: 150px;
  max-width: 400px;
  width: 100%;
  height: auto;
`;

function projectcard(props) {
  return (
    <>
      <Card>
        <Projectimg src={props.imagesrc} alt={props.imagealt} />
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
