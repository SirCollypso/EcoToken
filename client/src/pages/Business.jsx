import React from "react";
import { Navbar, BusinessMain, OngoingEvents, Footer } from "../components";

const Business = () => (
    <div className="flex flex-col min-h-screen">
    <div className="flex-1 gradient-bg-welcome">
      <Navbar />
      <BusinessMain />
      <OngoingEvents />
    </div>
    <Footer />
  </div>
);

export default Business;
