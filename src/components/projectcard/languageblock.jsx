import React, { useState, useEffect } from "react";
import styled from "styled-components";

const Langbox = styled.div``;

const AllLangContainer = styled.div``;

export default function Languageblock(props) {
  const [styledBoxes, setStyledBoxes] = useState([]);
  var workingBox;

  useEffect(() => {
    setStyledBoxes((styledBoxes) => [...styledBoxes, workingBox]);
  }, [workingBox]);

  for (let i = 0; i < props.langs.length; i++) {
    props.langs = <Langbox>{props.langs[i]}</Langbox>;
  }

  return <AllLangContainer>{styledBoxes}</AllLangContainer>;
}
