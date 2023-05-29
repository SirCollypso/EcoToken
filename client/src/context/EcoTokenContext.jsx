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
  const [formData, setformData] = useState({ addressTo: "", amount: "" });
  const [currentAccount, setCurrentAccount] = useState("");
  const [businessStatus, setBusinessStatus] = useState(localStorage.getItem("businessStatus"));
  const [clientBalance, setClientBalance] = useState(localStorage.getItem("clientBalance"));
  const [isLoading, setIsLoading] = useState(false);
  const [createdEventCount, setCreatedEventCount] = useState(localStorage.getItem("createdEventCount"));
  const [createdEvents, setCreatedEvents] = useState(localStorage.getItem("createdEvents"));

  const [ongoingEventCount, setOngoingEventCount] = useState(localStorage.getItem("ongoingEventCount"));
  const [ongoingEvents, setOngoingEvents] = useState([]);

  const handleChange = (e, name) => {
    setformData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  const checkIfWalletIsConnected = async () => {
    try { 
      if (!ethereum) return alert("Please install MetaMask.");
      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length) {
        setCurrentAccount(accounts[0]);
        await getAllOngoingEvents();
        await getBusinessStatus();
        await getClientBalance();
      } else {
        console.log("No accounts found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");
      const accounts = await ethereum.request({ method: "eth_requestAccounts", });
      setCurrentAccount(accounts[0]);
      window.location.reload();
    } catch (error) {
      console.log(error);
      throw new Error("No ethereum object");
    }
  };

  const getBusinessStatus = async () => {
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
        const options = {value: 1};
        const transactionHash = await ecoTokenContract.registerAsBusiness(options);
        setIsLoading(true);
        console.log(`Loading - ${transactionHash.hash}`);
        await transactionHash.wait();
        console.log(`Success - ${transactionHash.hash}`);
        setIsLoading(false);
        getBusinessStatus();
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
      throw new Error("No ethereum object");
    }
  };

  const getClientBalance = async () => {
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

  const checkIfCreatedEventsExist = async () => {
    try {
      if (ethereum) {
        const ecoTokenContract = await createEthereumContract();
        const currentCreatedEventCount = await ecoTokenContract.getCreatedEventCount();
        setCreatedEventCount(currentCreatedEventCount);
      }
    } catch (error) {
      console.log(error);
      throw new Error("No ethereum object");
    }
  };

  const getCreatedEvents = async () => {
    try {
      if (ethereum) {   
        const ecoTokenContract = await createEthereumContract();
        const createdEvents = await ecoTokenContract.getCreatedEvents();
        const structuredEvents = createdEvents.map((event) => ({
          id: event.id,
          description: event.description,
          reward: event.reward,
          organizer: event.organizer,
          rating: event.rating
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

  const checkIfOngoingEventsExist = async () => {
    try {
      if (ethereum) {
        const ecoTokenContract = await createEthereumContract();
        const currentOngoingEventCount = await ecoTokenContract.getEventCount();
        window.localStorage.setItem("ongoingEventCount", currentOngoingEventCount);
      }
    } catch (error) {
      console.log(error);
      throw new Error("No ethereum object");
    }
  };

  const getAllOngoingEvents = async () => {
    try {
      if (ethereum) {   
        const ecoTokenContract = await createEthereumContract();
        const availableEvents = await ecoTokenContract.getEvents();
        const structuredEvents = availableEvents.map((event) => ({
          id: event.id,
          description: event.description,
          reward: event.reward,
          organizer: event.organizer,
          rating: event.rating
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

  /*
  const sendTransaction = async () => {
    try {
      if (ethereum) {
        const { addressTo, amount, keyword, message } = formData;
        const transactionsContract = await createEthereumContract();
        const parsedAmount = ethers.utils.parseEther(amount);

        await ethereum.request({
          method: "eth_sendTransaction",
          params: [{
            from: currentAccount,
            to: addressTo,
            gas: "0x5208",
            value: parsedAmount._hex,
          }],
        });

        const transactionHash = await transactionsContract.addToBlockchain(addressTo, parsedAmount, message, keyword);

        setIsLoading(true);
        console.log(`Loading - ${transactionHash.hash}`);
        await transactionHash.wait();
        console.log(`Success - ${transactionHash.hash}`);
        setIsLoading(false);

        const transactionsCount = await transactionsContract.getTransactionCount();

        setTransactionCount(transactionsCount.toNumber());
        window.location.reload();
      } else {
        console.log("No ethereum object");
      }
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  };
  */

  useEffect(() => {
    checkIfWalletIsConnected();
    checkIfOngoingEventsExist();
  }, [clientBalance, ongoingEventCount]);

  return (
    <EcoTokenContext.Provider
      value={{
        currentAccount,
        connectWallet,
        clientBalance,
        businessStatus,
        registerAsBusiness,
        ongoingEventCount,
        isLoading,
        ongoingEvents,
        handleChange,
        formData,
      }}
    >
      {children}
    </EcoTokenContext.Provider>
  );
};
