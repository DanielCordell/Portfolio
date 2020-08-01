import React from "react";
import IntroBox from "./IntroBox";
import FloatyButton from "./FloatyButton";

export default function Main(props) {
  return (
    <>
      <IntroBox />
      <FloatyButton left="20vw" top="65vh" text="Software Engineer" />
      <FloatyButton left="80vw" top="65vh" text="Technical Educator" />
      <FloatyButton left="50vw" top="80vh" />
    </>
  );
}