import React, { useEffect, useState, useRef} from "react";
import { ethers, Contract, providers } from "ethers";
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';
import WalletConnectProvider from '@walletconnect/web3-provider';
import {tokenAddress, BoonAddress} from "../constants/constants"
import tokenAbi from "../constants/abi.json"
import boonAbi from "../constants/boonAbi.json"
import Web3Modal from "web3modal"

export const ConnectContext = React.createContext();
const { ethereum } = window;


const approve = async()=>{
  try{
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const tokenContract = new ethers.Contract(tokenAbi.abi, signer);

    console.log("about to approve tokens........")
    const amount = ethers.utils.parseEther("100");
    const getUserToken = await tokenContract.approve(BoonAddress,amount )
    console.log("approving token............")
    await getUserToken.wait()
    console.log("yay, we are done")
  
    
    }catch(error){
    console.log(error)
  }

}

export const ConnectProvider = ({ children }) =>{
    const [web3Modal, setWeb3Modal] = useState(null)
   const [connectedWallet, setConnectedWallet] = useState(false);
   const [account, setAccount] = useState("")
    console.log(connectedWallet)
   console.log(account)
  
   useEffect(() => {
    const providerOptions = {
      binancechainwallet: {
        package: true },
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId: 'f310138e40fd41378ef72775877c5e7c' } }, walletlink:{ 
            package: CoinbaseWalletSDK, 
          options: {
          appName: "Boon", 
          infuraId: "f310138e40fd41378ef72775877c5e7c", 
          rpc: "", 
          chainId: 5, 
          appLogoUrl: null, 
          theme: {
            background: "rgb(39, 56, 46)",
            main: "rgb(199, 180, 117)",
            secondary: "rgb(138, 120, 136)",
            border: "rgba(195, 195, 195, 0.14)",
            hover: "rgb(16, 28, 32)"
          }
        }
        },
    };

    const newWeb3Modal = new Web3Modal({
      cacheProvider: true, // very important
      network: "goerli",
      providerOptions,
    });

    setWeb3Modal(newWeb3Modal)
  }, [])
  useEffect(() => {
    // connect automatically and without a popup if user is already connected
    if(web3Modal && web3Modal.cachedProvider){
      connectWallet()
    }
  }, [web3Modal])

 
 
  async function connectWallet() {
    const provider = await web3Modal.connect();
    addListeners(provider);
    const ethersProvider = new providers.Web3Provider(provider)
    const userAddress = await ethersProvider.getSigner().getAddress()
    setAccount(userAddress)
    setConnectedWallet(true)
  }

  
  
  async function addListeners(web3ModalProvider) {

    web3ModalProvider.on("accountsChanged", (accounts) => {
      window.location.reload()
    });
    
    // Subscribe to chainId change
    web3ModalProvider.on("chainChanged", (chainId) => {
      window.location.reload()
    });
  }

 
  
    return (
      <ConnectContext.Provider
        value={{
          connectWallet,
          connectedWallet,
          account,
          approve
                   
        }}
      >
        {children}
      </ConnectContext.Provider>
    );
  };
