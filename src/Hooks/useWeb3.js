// src/hooks/useWeb3.js
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import ContractJSON from '../../build/contracts/MarketPlace.json';
import { CONTRACT_ADDRESS } from '../config/constants.js';

export const useWeb3 = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const initProvider = async () => {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);
      }
    };
    initProvider();
  }, []);

  const connectWallet = async () => {
    if (!provider) {
      alert("MetaMask is not installed.");
      return;
    }
    try {
      const accounts = await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        ContractJSON.abi,
        signer
      );

      setAccounts(accounts[0]);
      setSigner(signer);
      setContract(contract);

      return { accounts: accounts[0], contract };
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  return { provider, signer, accounts, contract, connectWallet };
};