import React from "react";
import { Navbar, Company, Footer } from "../components";

const About = () => (
  <div className="flex flex-col min-h-screen">
    <div className="flex-1 gradient-bg-welcome">
      <Navbar />
      <Company />
    </div>
    <Footer />
  </div>
);

export default About;
