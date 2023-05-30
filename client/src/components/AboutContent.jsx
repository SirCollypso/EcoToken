import React from "react";


const AboutContent = ({positionId, logo}) => {
  return (
    <div className="h-[40vh] flex w-full justify-center items-center m-10">
      {
            (positionId%2 === 1 )? (
        <div className="flex mf:flex-row flex-row items-center justify-between w-3/5">
            <div className="flex items-center flex-col w-1/2 justify-center">
                <div className="flex flex-col items-center">
                    <h1 className="text-4xl sm:text-5xl text-white text-gradient py-1">
                        Send Crypto <br /> across the world
                    </h1>
                    <p className="pl-4 flex-wrap mt-5 text-white text-base font-light md:w-9/12">
                        Explore the crypto world. Buy and sell cryptocurrencies easily on Krypto.
                    </p>   
                </div>
                   
            </div>
            <div className="flex items-center flex-col w-1/2">
                <img src={logo} alt='picture' className="w-1/2"/>
            </div>
            
        </div>) : (
        <div className="flex mf:flex-row flex-row items-center justify-between w-3/5">
            <div className="flex items-center flex-col w-1/2">
                <img src={logo} alt='picture' className="w-1/2"/>
            </div>
            <div className="flex items-center flex-col w-1/2 justify-center">
                <div className="flex flex-col items-center">
                    <h1 className="text-4xl sm:text-5xl text-white text-gradient py-1">
                        Send Crypto <br /> across the world
                    </h1>
                    <p className="pl-4 flex-wrap mt-5 text-white text-base font-light md:w-9/12">
                        Explore the crypto world. Buy and sell cryptocurrencies easily on Krypto.
                    </p>   
                </div>
                   
            </div>
            
        </div>
        )
    }  
    </div>
  );
};

export default AboutContent;