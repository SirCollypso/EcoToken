import React from "react";


const AboutContent = ({positionId, logo}) => {
  return (
    <div className="h-full flex w-full justify-center items-center m-10">
      {
            (positionId%2 === 1 )? (
        <div className="flex mf:flex-row flex-row items-center justify-between w-3/5">
            <div className="flex items-center flex-col w-1/2 justify-center">
                <div className="flex flex-col items-center">
                    <h1 className="text-4xl sm:text-5xl text-white text-gradient py-1 w-full">
                        What is <br /> EcoToken?
                    </h1>
                    <p className="flex items-start sflex-wrap mt-5 text-white text-base font-light md:w-full">
                    Developed by a team of KAIST students, EcoToken is a decentralized application that aims to incentivize people to lead a more sustainable lifestyle by rewarding them with digital tokens. These tokens can be redeemed for various rewards, such as discounts on sustainable products, eco-tours, and many more. EcoToken will allow third-party businesses to sign up for the service, through which they will reward their customers for participating in environmentally-friendly activities. This innovative project combines the blockchain technology and sustainability to encourage individuals to take actions that contribute towards a greener planet.
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
                    <h1 className="text-4xl sm:text-5xl text-white text-gradient py-1 w-full">
                        Ethereum Blockchain <br /> for a better cause
                    </h1>
                    <p className="flex items-start flex-wrap mt-5 text-white text-base font-light md:w-full">
                    EcoToken is being run on top of Sepolia Ethereum testnet. By paying 0.05ETH on the platform, businesses can subscribe to the platform and receive 1000 EcoTokens. After the sign up, businesses will be able to host events, in which business customers can participate. After having participated in an event, members will be able to give the event a rating, which will contribute towards the overall rating of a business. The number of tokens a business receives from the platform will depend on the overall rating of the business. Additionally, businesses will be able to reward participants with tokens, which can then be used by customers as a currency at participating retailers. The number of tokens received as a reward is equal to the rating of the business divided by the event reward rate.
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