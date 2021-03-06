import React, { useState } from "react";
import IntroBox from "./IntroBox";
import FloatyButton from "../FloatyButton";

const buttonDetails = [
  { style: { float: "left",  marginLeft: "9em",   marginTop: "-10em", animationDelay: "-0.6s" }, text: "Software Engineer" },
  { style: { margin: "3em auto 0", display: "block",  animationDelay: "-0.3s", position: "absolute", left: "0", "right": "0"}, text: "Technical Educator" },
  { style: { float: "right", marginRight: "9em", marginTop: "-10em", animationDelay: "-0s" }, text: "Game Develeoper" },
]

export default function Main(props) {
  const [highlightedButtonIndex, setHighlightedButtonIndex] = useState(0);

  return (
    <>
      <IntroBox text={buttonDetails[highlightedButtonIndex].text}/>
        {
          buttonDetails.map((it, i) => <FloatyButton key={i} style={it.style} text={it.text} stillMode={props.stillMode} setHighlightedButton={() => {setHighlightedButtonIndex(i)}} />)
        }
    </>
  );
}