import styled from "styled-components";
import React from "react";

const Card = styled.div`
  color: white;
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 20px;
  width: auto;
  max-width: 1024px;
  display: flex;
  flex-wrap: wrap;
`;

const Appinfo = styled.div`
  margin: 5px;
  padding: 5px;
  line-height: 1.7;
  width: 375px;
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
  width: auto;
`;

const Projectimg = styled.img`
  min-width: 100px;
  max-width: 400px;
  width: 100%;
`;

// const LanguageBlock = styled.div`
//   background-color: grey;
// `;

function projectcard(props) {
  // const [langs, setLangs] = useState([]);
  // let block;

  // const Contructlangs = (props) => {
  //   let languageblocks = [];
  //   const arroflangs = props.langs.split("");
  //   arroflangs.map(
  //     (x) => (block = <LanguageBlock>{x}</LanguageBlock>),
  //     setLangs([...langs, block])
  //   );
  // };

  // useEffect({
  //   Contructlangs,
  // });

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
