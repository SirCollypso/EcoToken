import React from "react";
import { Link } from 'react-router-dom';

const Footer = () => (
  <div className="mt-auto w-full flex md:justify-center justify-between items-center flex-col p-4 gradient-bg-footer">
    <div className="w-full flex sm:flex-row flex-col justify-between items-center my-4">
      <div className="flex flex-1 justify-evenly items-center flex-wrap sm:mt-0 mt-5 w-full">
        <p className="box-content h-8 w-32 text-white text-base text-center mx-2 cursor-pointer">{<Link to="/">For Individuals</Link>}</p>
        <p className="box-content h-8 w-32 text-white text-base text-center mx-2 cursor-pointer">{<Link to="/business">For Businesses</Link>}</p>
        <p className="box-content h-8 w-32 text-white text-base text-center mx-2 cursor-pointer">{<Link to="/about">About Us</Link>}</p>
      </div>
    </div>

    <div className="flex justify-center items-center flex-col mt-5">
      <p className="text-white text-sm text-center">Come join us and make the world greener</p>
    </div>

    <div className="sm:w-[90%] w-full h-[0.25px] bg-gray-400 mt-5 " />

    <div className="sm:w-[90%] w-full flex justify-between items-center mt-3">
      <p className="text-white text-left text-xs">@greenchain2023</p>
      <p className="text-white text-right text-xs">MIT License</p>
    </div>
  </div>
);

export default Footer;
