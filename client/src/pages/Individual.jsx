import React from "react";
import { Navbar, IndividualMain, OngoingEvents, Footer } from "../components";

const Individual = () => (
    <div className="flex flex-col min-h-screen">
    <div className="flex-1 gradient-bg-welcome">
      <Navbar />
      <IndividualMain />
      <OngoingEvents />
    </div>
    <Footer />
  </div>
);

export default Individual;
