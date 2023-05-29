import React, { useContext } from "react";
import { AiFillPlayCircle } from "react-icons/ai";
import { SiEthereum } from "react-icons/si";
import { BsInfoCircle } from "react-icons/bs";

import { EcoTokenContext } from "../context/EcoTokenContext";
import { shortenAddress } from "../utils/shortenAddress";

import { Loader } from ".";

const Input = ({ placeholder, name, type, value, handleChange }) => (
  <input
    placeholder={placeholder}
    type={type}
    value={value}
    onChange={(e) => handleChange(e, name)}
    className="my-2 w-full rounded-sm p-2 outline-none text-[#ffffff] bg-transparent text-white border-none text-sm white-glassmorphism"
  />
);

const EventCard = ({ id, reward, description, rating}) => {
  return (
    <div className="blue-glassmorphism m-4 flex flex-1
      2xl:min-w-[450px]
      2xl:max-w-[500px]
      sm:min-w-[270px]
      sm:max-w-[300px]
      min-w-full
      flex-col p-3 rounded-md hover:shadow-2xl"
    >
      <div className="flex flex-col items-center w-full mt-3">
        <div className="display-flex justify-start w-full mb-6 p-2">
          <p className="text-white text-base">Event ID: {id}</p>
          <p className="text-white text-base">Reward: {reward} EcoTokens</p>
          <p className="text-white text-base">Description: {description}</p>
          <p className="text-white text-base">Rating: {rating}</p>
        </div>
      </div>
    </div>
  );
};

const BusinessMain = () => {
  const { currentAccount, connectWallet, clientBalance, businessStatus, registerAsBusiness, createdEvents, createEvent, markPartcipant, isLoading, handleBusinessChange, businessFormData } = useContext(EcoTokenContext);

  const handleMarkSubmit = (e) => {
    const { address, eventID } = businessFormData;

    e.preventDefault();

    if (!address || !eventID) return;
    
    markPartcipant();
  };

  const handleCreateSubmit = (e) => {
    const { description, reward } = businessFormData;

    e.preventDefault();

    if (!description || !reward) return;

    createEvent();
  };

  return (
    <div className="flex flex-col w-full justify-center items-center">
      <div className="flex mf:flex-row flex-col items-center justify-between">
        { (currentAccount && businessStatus) 
        ? (
          <div className="flex flex-col flex-1 items-center justify-start w-full mf:mt-0 mt-10">
            
            <div className="p-3 flex justify-end items-start flex-col rounded-xl h-40 sm:w-72 w-full my-5 eth-card .white-glassmorphism ">
              <div className="flex justify-between flex-col w-full h-full">
                <div className="flex justify-between items-start">  
                  <div className="w-10 h-10 rounded-full border-2 border-white flex justify-center items-center">
                    <SiEthereum fontSize={21} color="#fff" />
                  </div>
                  <BsInfoCircle fontSize={17} color="#fff" />
                </div>        
                <div>
                  <p className="text-white font-light text-sm">{shortenAddress(currentAccount)}</p>
                  <p className="text-white text-base font-semibold text-lg mt-1">{clientBalance} EcoToken</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap justify-center items-center mt-10">
              
              <div className="m-5 p-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism">
                <Input placeholder="Address" name="address" type="text" handleChange={handleBusinessChange} />
                <Input placeholder="Event ID" name="eventID" type="number" handleChange={handleBusinessChange} />
                <div className="h-[1px] w-full bg-gray-400 my-2" />
                <button type="button" onClick={handleMarkSubmit} className="text-white w-full mt-2 border-[1px] p-2 border-[#06416d] hover:bg-[#06416d] rounded-full cursor-pointer">Mark Participant</button>
              </div>

              <div className="m-5 p-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism">
                <Input placeholder="Description" name="description" type="text" handleChange={handleBusinessChange} />
                <Input placeholder="Reward" name="reward" type="number" handleChange={handleBusinessChange} />
                <div className="h-[1px] w-full bg-gray-400 my-2" />
                <button type="button" onClick={handleCreateSubmit} className="text-white w-full mt-2 border-[1px] p-2 border-[#06416d] hover:bg-[#06416d] rounded-full cursor-pointer">Create Event</button>
              </div>

            </div>

            {(isLoading) && (<Loader />) }

            <div className="flex flex-col md:p-12 py-12 px-4">
              <h3 className="text-white text-3xl text-center my-2">Organized Events</h3>
              <div className="flex flex-wrap justify-center items-center mt-10">
                {[...createdEvents].reverse().map((event, i) => (
                  <EventCard key={i} {...event} />
                ))}
              </div>
            </div>

          </div>
          ) 
        : (
          <div className="flex flex-1 justify-center items-center flex-col mf:mr-10 md:p-20 py-12 px-4">
            
            <h1 className="text-center sm:text-5xl text-white text-gradient py-1">Register as Business</h1>
            <p className="text-center mt-5 text-white font-light md:w-9/12 w-11/12 text-base">Description.</p>
            
            {!currentAccount && (
              <button type="button" onClick={connectWallet} className="flex flex-row justify-center items-center my-5 bg-[#1baf8f] p-3 rounded-full cursor-pointer hover:bg-[#06416d]">
                <AiFillPlayCircle className="text-white mr-2" />
                <p className="text-white text-base font-semibold">Connect Wallet</p>
              </button>
            )}

            {(currentAccount && !businessStatus) && (
              <button type="button" onClick={registerAsBusiness} className="flex flex-row justify-center items-center my-5 bg-[#1baf8f] p-3 rounded-full cursor-pointer hover:bg-[#06416d]">
                <AiFillPlayCircle className="text-white mr-2" />
                <p className="text-white text-base font-semibold">Register as Business for 1 WEI</p>
              </button>
            )}

            {(currentAccount && !businessStatus && isLoading) && (<Loader />) }

          </div>
          )
        }
      </div>
    </div>
  );
};

export default BusinessMain;
