import React from "react";
import { Navbar, Welcome, Footer, OngoingEvents } from "../components";

const Home = () => (
  <div className="min-h-screen">
    <div className="gradient-bg-welcome">
      <Navbar />
      <Welcome />
    </div>
    <OngoingEvents />
    <Footer />
  </div>
);

export default Home;
