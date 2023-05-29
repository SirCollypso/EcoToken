import React from "react";

import logo from "../../images/logo.png";

const Footer = () => (
  <div className="mt-auto w-full flex md:justify-center justify-between items-center flex-col p-4 gradient-bg-footer">
    <div className="w-full flex sm:flex-row flex-col justify-between items-center my-4">
      <div className="flex flex-1 justify-evenly items-center flex-wrap sm:mt-0 mt-5 w-full">
        <p className="text-white text-base text-center mx-2 cursor-pointer">For Individuals</p>
        <p className="text-white text-base text-center mx-2 cursor-pointer">For Businesses</p>
        <p className="text-white text-base text-center mx-2 cursor-pointer">About Us</p>
      </div>
    </div>

    <div className="flex justify-center items-center flex-col mt-5">
      <p className="text-white text-sm text-center">Come join us and make the world greener</p>
      <p className="text-white text-sm text-center font-medium mt-2">amin@kaist.ac.kr</p>
    </div>

    <div className="sm:w-[90%] w-full h-[0.25px] bg-gray-400 mt-5 " />

    <div className="sm:w-[90%] w-full flex justify-between items-center mt-3">
      <p className="text-white text-left text-xs">@greenchain2023</p>
      <p className="text-white text-right text-xs">MIT License</p>
    </div>
  </div>
);

export default Footer;
