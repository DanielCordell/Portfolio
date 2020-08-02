import React, { useState } from "react";
import IntroBox from "./IntroBox";
import FloatyButton from "./FloatyButton";

const buttonDetails = [
  { style: { float: "left",  marginLeft: "6em",   marginTop: "-10em", animationDelay: "0s" }, text: "Something Else Here" },
  { style: { float: "right", marginRight: "9em", marginTop: "-7em", animationDelay: "-0.3s" }, text: "Technical Educator (OR) Event Organiser" },
  { style: { margin: "5em auto 0", display: "block",  animationDelay: "-0.6s", position: "absolute", left: "0", "right": "0"}, text: "Software Engineer" }
]


export default function Main(props) {

  const [highlightedButtonIndex, setHighlightedButtonIndex] = useState(2)

  return (
    <>
      <IntroBox text={buttonDetails[highlightedButtonIndex].text}/>
      <div style={{marginTop: "3em"}}>
        {
          buttonDetails.map((it, i) => <FloatyButton key={i} style={it.style} text={it.text} onHover={() => {console.log("hmm"); setHighlightedButtonIndex(i)}} />)
        }
      </div>
    </>
  );
}