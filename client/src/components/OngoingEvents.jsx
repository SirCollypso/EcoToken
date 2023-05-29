import React, { useContext } from "react";

import { EcoTokenContext } from "../context/EcoTokenContext";

import { shortenAddress } from "../utils/shortenAddress";

const EventCard = ({ id, organizer, reward, description, rating}) => {

  return (
    <div className="bg-[#181918] m-4 flex flex-1
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
          <a href={`https://sepolia.etherscan.io/address/${organizer}`} target="_blank" rel="noreferrer">
            <p className="text-white text-base">Organizer: {shortenAddress(organizer)}</p>
          </a>
          <p className="text-white text-base">Reward: {reward} EcoTokens</p>
          <p className="text-white text-base">Description: {description}</p>
          <p className="text-white text-base">Rating: {rating}</p>
        </div>
      </div>
    </div>
  );
};

const OngoingEvents = () => {
  const { ongoingEvents } = useContext(EcoTokenContext);

  return (
    <div className="flex w-full justify-center items-center 2xl:px-20 gradient-bg-transactions">
      <div className="flex flex-col md:p-12 py-12 px-4">
        <h3 className="text-white text-3xl text-center my-2">
          Ongoing Events
        </h3>
        <div className="flex flex-wrap justify-center items-center mt-10">
          {[...ongoingEvents].reverse().map((event, i) => (
            <EventCard key={i} {...event} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default OngoingEvents;
