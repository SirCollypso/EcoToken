import React from "react";
import { Navbar, IndividualMain, Footer } from "../components";

const Individual = () => (
    <div className="flex flex-col min-h-screen">
    <div className="flex-1 gradient-bg-welcome">
      <Navbar />
      <IndividualMain />
    </div>
    <Footer />
  </div>
);

export default Individual;
