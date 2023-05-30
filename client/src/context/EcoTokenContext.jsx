import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

import { contractABI, contractAddress } from "../utils/constants";

export const EcoTokenContext = React.createContext();

const { ethereum } = window;

const createEthereumContract = async () => {
  const provider = new ethers.BrowserProvider(ethereum);
  const signer = await provider.getSigner();
  const ecoTokenContract = new ethers.Contract(contractAddress, contractABI, signer);
  return ecoTokenContract;
};

export const EcoTokenProvider = ({ children }) => {
  
  const [businessFormData, setBusinessFormData] = useState({ address: "", eventID: "", description: "", reward: "" });
  const [individualFormData, setIndividualFormData] = useState({ address: "", amount: "", eventID: "", score: "" });
  const [currentAccount, setCurrentAccount] = useState("");
  const [baseValueEth, setBaseValueEth] = useState(localStorage.getItem("baseValueEth"));
  const [businessStatus, setBusinessStatus] = useState(localStorage.getItem("businessStatus"));
  const [clientBalance, setClientBalance] = useState(localStorage.getItem("clientBalance"));
  const [createdEvents, setCreatedEvents] = useState([]);
  const [participatedEvents, setParticipatedEvents] = useState([]);
  const [ongoingEvents, setOngoingEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleBusinessChange = (e, name) => {
    setBusinessFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  const handleIndividualChange = (e, name) => {
    setIndividualFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  const updateAllStates = async() => {
    try { 
      if (!ethereum) return alert("Please install MetaMask.");
      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length) {
        setCurrentAccount(accounts[0]);
        updateBaseValueEth();
        await updateBusinessStatus();
        await updateClientBalance();
        if (businessStatus === true) {
          updateCreatedEvents();
        } else if (businessStatus === false) {
          updateParticipatedEvents();
        }
        await updateOngoingEvents();
      } else {
        console.log("No accounts found");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");
      const accounts = await ethereum.request({ method: "eth_requestAccounts", });
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
      throw new Error("No ethereum object");
    }
  };

  const updateBaseValueEth = async () => {
    try {
      if (ethereum) {
        const ecoTokenContract = await createEthereumContract();
        const currentBaseValueEth = await ecoTokenContract.getBaseValueEth();
        setBaseValueEth(ethers.formatEther(currentBaseValueEth).toString());
      }
    } catch (error) {
      console.log(error);
      throw new Error("No ethereum object");
    }
  };

  const updateBusinessStatus = async () => {
    try {
      if (ethereum) {
        const ecoTokenContract = await createEthereumContract();
        const currentBusinessStatus = await ecoTokenContract.getBusinessStatus();
        setBusinessStatus(currentBusinessStatus);
      }
    } catch (error) {
      console.log(error);
      throw new Error("No ethereum object");
    }
  };

  const registerAsBusiness = async () => {
    try {
      if (ethereum) {
        const ecoTokenContract = await createEthereumContract(); 
        const currentBaseValueEth = await ecoTokenContract.getBaseValueEth();
        const options = {value: currentBaseValueEth};
        const transactionHash = await ecoTokenContract.registerAsBusiness(options);
        setIsLoading(true);
        console.log(`Loading - ${transactionHash.hash}`);
        await transactionHash.wait();
        console.log(`Success - ${transactionHash.hash}`);
        setIsLoading(false);
        updateBusinessStatus();
      }
    } catch (error) {
      console.log(error);
      throw new Error("No ethereum object");
    }
  };

  const updateClientBalance = async () => {
    try {
      if (ethereum) {
        const ecoTokenContract = await createEthereumContract();
        const currentClientBalance = await ecoTokenContract.getClientBalance();
        setClientBalance(currentClientBalance.toString());
      }
    } catch (error) {
      console.log(error);
      throw new Error("No ethereum object");
    }
  };

  const updateCreatedEvents = async () => {
    try {
      if (ethereum) {   
        const ecoTokenContract = await createEthereumContract();
        const createdEvents = await ecoTokenContract.getCreatedEvents();
        const structuredEvents = createdEvents.map((event) => ({
          id: event.id.toString(),
          description: event.description.toString(),
          reward: event.reward.toString(),
          organizer: event.organizer.toString(),
          rating: event.rating.toString()
        }));
        console.log(structuredEvents);
        setCreatedEvents(structuredEvents);
      } else {
        console.log("Ethereum is not present");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateParticipatedEvents = async () => {
    try {
      if (ethereum) {   
        const ecoTokenContract = await createEthereumContract();
        const participatedEvents = await ecoTokenContract.getParticipatedEvents();
        const structuredEvents = participatedEvents.map((event) => ({
          id: event.id.toString(),
          description: event.description.toString(),
          reward: event.reward.toString(),
          organizer: event.organizer.toString(),
          rating: event.rating.toString()
        }));
        console.log(structuredEvents);
        setParticipatedEvents(structuredEvents);
      } else {
        console.log("Ethereum is not present");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateOngoingEvents = async () => {
    try {
      if (ethereum) {   
        const ecoTokenContract = await createEthereumContract();
        const ongoingEvents = await ecoTokenContract.getEvents();
        const structuredEvents = ongoingEvents.map((event) => ({
          id: event.id.toString(),
          description: event.description.toString(),
          reward: event.reward.toString(),
          organizer: event.organizer.toString(),
          rating: event.rating.toString()
        }));
        console.log(structuredEvents);
        setOngoingEvents(structuredEvents);
      } else {
        console.log("Ethereum is not present");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const markPartcipant = async () => {
    try {
      if (ethereum) {
        const { address, eventID } = businessFormData;
        const ecoTokenContract = await createEthereumContract(); 
        const transactionHash = await ecoTokenContract.markParticipant(address, eventID);
        setIsLoading(true);
        console.log(`Loading - ${transactionHash.hash}`);
        await transactionHash.wait();
        console.log(`Success - ${transactionHash.hash}`);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      throw new Error("No ethereum object");
    }
  }

  const createEvent = async () => {
    try {
      if (ethereum) {
        const { description, reward } = businessFormData;
        const ecoTokenContract = await createEthereumContract(); 
        const transactionHash = await ecoTokenContract.createEvent(description, reward);
        setIsLoading(true);
        console.log(`Loading - ${transactionHash.hash}`);
        await transactionHash.wait();
        console.log(`Success - ${transactionHash.hash}`);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      throw new Error("No ethereum object");
    }
  }

  const transferEcotokens = async () => {
    try {
      if (ethereum) {
        const { address, amount } = individualFormData;
        const ecoTokenContract = await createEthereumContract(); 
        const transactionHash = await ecoTokenContract.transferEcotokens(address, amount);
        setIsLoading(true);
        console.log(`Loading - ${transactionHash.hash}`);
        await transactionHash.wait();
        console.log(`Success - ${transactionHash.hash}`);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      throw new Error("No ethereum object");
    }
  }

  const voteForEvent = async () => {
    try {
      if (ethereum) {
        const { eventID, score } = individualFormData;
        const ecoTokenContract = await createEthereumContract(); 
        const transactionHash = await ecoTokenContract.voteForEvent(eventID, score);
        setIsLoading(true);
        console.log(`Loading - ${transactionHash.hash}`);
        await transactionHash.wait();
        console.log(`Success - ${transactionHash.hash}`);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      throw new Error("No ethereum object");
    }
  }

  useEffect(() => {
    updateAllStates();
  }, [currentAccount, businessStatus, isLoading]);

  return (
    <EcoTokenContext.Provider
      value={{
        currentAccount,
        connectWallet,
        baseValueEth,
        clientBalance,
        businessStatus,
        registerAsBusiness,
        createdEvents,
        participatedEvents,
        ongoingEvents,
        createEvent,
        markPartcipant,
        transferEcotokens,
        voteForEvent,
        isLoading,
        handleBusinessChange,
        handleIndividualChange,
        businessFormData,
        individualFormData
      }}
    >
      {children}
    </EcoTokenContext.Provider>
  );
};