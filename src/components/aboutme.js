//import react from 'react'
import styled from "styled-components";



const Introduction = styled.div`
width: auto;
max-width: 350px;
background-color: #171717;
color: white;
border-radius: 6px;
padding: 15px;

line-height: 1.5;
align-self: center;
font-size: 120%;
`


const AboutMe=()=>{


    return (
        <Introduction>
 
        My name is Davon Whitworth, I am a CS major pursuing a bachelors. Most of my devlopment experience is in Front-End utilizing javascipt, typescript, HTML, and CSS. 
      
    </Introduction>
    )
}

export default AboutMe;