import React, { useEffect, useState, useRef} from "react";
import { ethers, Contract, providers } from "ethers";
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';
import WalletConnectProvider from '@walletconnect/web3-provider';

import { contractABI, contractAddress } from "../components/utilities/constants";
import { tokenAddress, BoonAddress } from "../constants/constants";
import tokenAbi from "../constants/abi.json"
import boonAbi from "../constants/boonAbi.json"

export const ConnectContext = React.createContext();

const { ethereum } = window;

const createEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const nestdriveContract = new ethers.Contract(contractAddress, contractABI, signer);
 
  return nestdriveContract;
};
const airdrop = async() =>{
  try{
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const tokenContract = new ethers.Contract(BoonAddress, boonAbi.abi, signer);

    const airAddress = ["0x3849DDF392848582b860982740615b43AA537aC2","0x3849DDF392848582b860982740615b43AA537aC2"]
    const airAmount = [50,50]
    const giftToken = await tokenContract.airdrop(tokenAddress,airAddress,airAmount)
    console.log("sending tokens............")
    await giftToken.wait()
    console.log("yay, we are done")
  
    
    }catch(error){
    console.log(error)
  }

}
const approve = async() => {
  try{
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const tokenContract = new ethers.Contract(tokenAddress, tokenAbi.abi, signer);

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
const fetchPublic = async() => {
  const contract = createEthereumContract();
  
 try {
   const result =await contract.fetchPublicFiles();
  
  return result
  }
 catch(error){
   console.log(error)
 
 }
}

const fetchAll = async(ID) => {
  const contract = createEthereumContract();
  
 try {
   const result =await contract.Allfiles(ID);
  
  return result
  }
 catch(error){
   console.log(error)
  
 }
}

const takeAction = async( fileid) => {
  const contract = createEthereumContract();
  
 try {

  await contract.makeReportedPrivate(fileid);
  

  }
 catch(error){
   console.log(error)
  
 }
}

const fetchPrivate = async() => {
  const contract = createEthereumContract();
  
 try {
   const  result =await contract.fetchUserFiles();
  
  return result
  }
 catch(error){
   console.log(error)
 
 }
}

const makePrivate = async(id) => {
  const contract = createEthereumContract();
  
 try {
   const  result =await contract.makeFilePrivate(id);
  
  return result
  }
 catch(error){
   console.log(error)
 
 }
}

const makePublic = async(id) => {
  const contract = createEthereumContract();
  
 try {
   const  result =await contract.makeFilePublic(id);
  
  return result
  }
 catch(error){
   console.log(error)
 
 }
}


const uploads = async(hash, size, type, name, description, isPublic) => {
  
  
  try {
   if (ethereum) {
     const transactionsContract = createEthereumContract();
    await transactionsContract.uploadFile(hash, size, type, name, description, isPublic,{
     gasPrice: 100,
     gasLimit: 1000000
 });}
   }
 
  catch(error){
    console.log(error)
   
  }
 }


 const makeMod = async(addr) => {
  const contract = createEthereumContract();
  
 try {
   const  result =await contract.assignMod(addr);
  
  return result
  }
 catch(error){
   console.log(error)
 
 }
}


const remMod = async(addr) => {
  const contract = createEthereumContract();
  
 try {
   const  result =await contract.removeMod(addr);
  
  return result
  }
 catch(error){
   console.log(error)
  
 }
}

const reportFile = async(id) => {
  const contract = createEthereumContract();
  
 try {
   const  result =await contract.report(id);
  
  return result
  }
 catch(error){
   console.log(error)

 }
}

const reportedList = async(id) => {
  const contract = createEthereumContract();
  
 try {
   const  result =await contract.reportedListArray();
  //console.log(result)
  return result
  }
 catch(error){
   console.log(error)
  
 }
}



const checkModerator = async(addr) => {
  const contract = createEthereumContract();
  
 try {
   const result = await contract.checkMod(addr);
  return result
  }
 catch(error){
   console.log(error)
  
 }
}

const add2Blacklist = async(addr) => {
  const contract = createEthereumContract();
  
 try {
   const result = await contract.addToBlackList(addr);
  console.log(result)
  return result
  }
 catch(error){
   console.log(error)
 
 }
}

const remFrmBlacklist = async(addr) => {
  const contract = createEthereumContract();
  
 try {
   const result = await contract.removeFromBlackList(addr);
  console.log(result)
  return result
  }
 catch(error){
   console.log(error)
 
 }
}

const blackList = async(id) => {
  const contract = createEthereumContract();
  
 try {
   const  result =await contract.blackListArray();
  
  return result
  }
 catch(error){
   console.log(error)
  
 }
}

const pauseContract = async(id) => {
  const contract = createEthereumContract();
  
 try {
   const  result =await contract.pause();
  
  return result
  }
 catch(error){
   console.log(error)
  
 }
}

const unPauseContract = async(id) => {
  const contract = createEthereumContract();
  
 try {
   const  result =await contract.unpause();
  
  return result
  }
 catch(error){
   console.log(error)
  
 }
}





export const ConnectProvider = ({ children }) =>{
    const [currentAccount, setCurrentAccount] = useState("");
    const checkIfWalletIsConnect = async () => {
      
      try {
        if (!ethereum) return alert("Please install MetaMask.");
       // const provider = new ethers.providers.Web3Provider(ethereum);
        const accounts = await ethereum.request({ method: "eth_accounts" });
  
        if (accounts.length) {
        //  setCurrentAccount(await provider.lookupAddress(accounts[0]));
        setCurrentAccount(accounts[0]);
      
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

    useEffect(() => {
      checkIfWalletIsConnect();
    }, []);
  
    return (
      <ConnectContext.Provider
        value={{
          checkModerator,
          pauseContract,
          unPauseContract,
          remFrmBlacklist,
          currentAccount,
          connectWallet,
          add2Blacklist,
          fetchPrivate,
          reportedList,
          fetchPublic,
          makePrivate,
          makePublic,
          takeAction,
          reportFile,
          blackList,
          fetchAll,
          uploads,
          makeMod,
          remMod,
          approve,
          airdrop
        }}
      >
        {children}
      </ConnectContext.Provider>
    );
  };

 


