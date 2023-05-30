import React from "react";
import { Navbar, Company, Footer } from "../components";
import AboutContent from "../components/AboutContent.jsx";
import animated from "../../images/animated.svg";
import ethereumLogo from "../../images/ethereumLogo.svg";

const About = () => (
  <div className="flex flex-col">
    <div className="flex flex-1 flex-col gradient-bg-welcome items-center">
      <Navbar />
      <Company/>
      <AboutContent positionId={1} logo={animated}/>
      <AboutContent positionId={2} logo={ethereumLogo}/>
    </div>
    <Footer />
  </div>
);

export default About;