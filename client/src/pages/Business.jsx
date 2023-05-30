import React from "react";
import { Navbar, BusinessMain, Footer } from "../components";

const Business = () => (
    <div className="flex flex-col min-h-screen">
    <div className="flex-1 gradient-bg-welcome">
      <Navbar />
      <BusinessMain />
    </div>
    <Footer />
  </div>
);

export default Business;
