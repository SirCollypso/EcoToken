import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

import { contractABI, contractAddress } from "../utils/constants";

export const TransactionContext = React.createContext();

const { ethereum } = window;

const createEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const ecoTokenContract = new ethers.Contract(contractAddress, contractABI, signer);
  
  return ecoTokenContract;
};

export const OngoingEventsProvider = ({ children }) => {
  //const [formData, setformData] = useState({ addressTo: "", amount: "", keyword: "", message: "" });
  const [currentAccount, setCurrentAccount] = useState("");
  //const [isLoading, setIsLoading] = useState(false);
  const [ongoingEventCount, setOngoingEventCount] = useState(localStorage.getItem("ongoingEventCount"));
  const [ongoingEvents, setOngoingEvents] = useState([]);

  const handleChange = (e, name) => {
    setformData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  const getAllOngoingEvents = async () => {
    try {
      if (ethereum) {
        const ecoTokenContract = createEthereumContract();

        const availableEvents = await ecoTokenContract.getEvents()();

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

  const checkIfWalletIsConnect = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length) {
        setCurrentAccount(accounts[0]);

        getAllOngoingEvents();
      } else {
        console.log("No accounts found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfOngoingEventsExists = async () => {
    try {
      if (ethereum) {
        const ecoTokenContract = createEthereumContract();
        const currentOngoingEventCount = await ecoTokenContract.getEventCount();

        window.localStorage.setItem("ongoingEventCount", currentOngoingEventCount);
      }
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
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

  /*
  const sendTransaction = async () => {
    try {
      if (ethereum) {
        const { addressTo, amount, keyword, message } = formData;
        const transactionsContract = createEthereumContract();
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
    checkIfWalletIsConnect();
    checkIfOngoingEventsExists();
  }, [ongoingEventCount]);

  return (
    <OngoingEventsContext.Provider
      value={{
        ongoingEventCount,
        connectWallet,
        ongoingEvents,
        currentAccount,
        handleChange,
        formData,
      }}
    >
      {children}
    </OngoingEventsContext.Provider>
  );
};
