import React, {useState, useEffect, useContext} from 'react';
import './possibility.css';
import { ethers } from 'ethers';
import tokenAbi from '../../constants/abi.json'
import nftAbi from '../../constants/NFT.json'
import { BoonAddress } from '../../constants/constants';
import 'react-dropdown/style.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { ConnectContext } from "../../context/ConnectContext";
import boonAbi from "../../constants/boonAbi.json"
import { BigNumber } from 'ethers';




const Input = ({ placeholder, type, handleChange}) => (
  <input
    placeholder={placeholder}
    type={type}
    step="0.0001"
    // value={value}
    onChange={(e) => handleChange(e)}
    className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
  />
);

 
const Possibility = () => {
  const {account} = useContext(ConnectContext);
    const [nftList, setNftList] = useState([])
    const [airdropAmount, setAirdropAmount] = useState([])
    const [approved, setApproved] = useState(false)
    const [last, setLast] = useState(false)
    const [loading, setLoading] = useState(false)
    const [network, setNetwork] = useState('')
    const [owners, setOwners] = useState([])
    const [balance, setBalance] = useState(0)
    
  const [customerAddresses, setcustomerAddresses] = useState([]);
  
  const [reward, setreward] = useState([]);
  const [form, setForm]=useState(false)
  
   const [isFileUpload, setisFileUpload] = useState(false);
  
   const [nft , setNft] = useState("")
  
   const [tokenDetails, setTokenDetails] = React.useState({
    tokenAddress: "",
    amount: "", 
    NftAddress:""
})


const airdropNft = async() => {

 try{

  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const airdropContract = new ethers.Contract(BoonAddress, boonAbi.abi, signer);

  const giveaway= await airdropContract.nftdrop(tokenDetails.tokenAddress, customerAddresses, reward)
 
  await giveaway.wait()

  success()
  
}catch(error) {
  invalid()
  console.log(error)
}

}



  // function to convert csv file from input file to arr, it receives a str paramater
  const csvToArray = (str) => {
    // split arrays the file according to \n newline regex
   // const firstArr = str.split("\n");
   const firstArr = str.split("\r\n");
   
    // mapping over the array to create a second arr
    let secondArr = firstArr.map((item) => {
      return item.split(',');
    });
    // secondArr=[[address, reward],[address, reward] etc]
    // console.log(secondArr)

    // mapping over the secondArr to get a distinct arr of address
    const address = secondArr.map((item) => item[0] // [addresses]
    ).filter(entry => /\S/.test(entry));
    // mapping over the secondArr to get a distinct arr of rewards and returning it
    const values = secondArr.map((item) => {

      return item[1]; // [rewards]
    }).filter(entry => /\S/.test(entry));

    secondArr = [address, values];  // secondArr=[[addresses],[rewards]]
    return secondArr;
  };
  
  // function to handle uploading file and getting initial readings
  function handlecsv(e) {
    e.preventDefault();
    // input file tag is is cvsFile
    console.log("ok");
   // const csvFile = document.getElementById("csvFile");
   const input = e.target.files[0];
    // reading the file
    const reader = new FileReader();

    reader.onload = function(e) {
      const text = e.target.result;

      // calling our csvToArray(str) to convert to array
      // data here is like our secondArray earlier
      const data = csvToArray(text);

      // setisFileUpload to true as we've uploaded our file
      setisFileUpload(true);

      // update our customerAddresses array
      setcustomerAddresses(data[0]);

      // update our rewards array
      setreward(data[1]);

    };

    reader.readAsText(input);

  };




const upload = async() => {
  try{
    
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const airdropContract = new ethers.Contract(BoonAddress, boonAbi.abi, signer);

  const giveaway= await airdropContract.airdrop(tokenDetails.tokenAddress, customerAddresses, reward)

  await giveaway.wait()

  success()
  }catch(error){notify()}
}



useEffect( ()=>{
  fetch('https://api.cybertino.io/connect/',{
    method:"POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({query: `{
      nftOwners(contract: ${tokenDetails.NftAddress}) {
        owner
         }
    }`})
  }).then(response => response.json())
  .then(data => setOwners(data))
  .catch( err => {
    console.log(err)
    invalid()
  })
},[])

useEffect(()=>{},[approved])
const notify = () => toast.error("Invalid entries, Please check address or balance");
const success = () => toast.success("your have successfully approved tokens")
const invalid =() => toast.error("you do not have enough NFTs")
const sucess = () => toast.success("your have successfully airdropped tokens")
const { ethereum } = window;
let array = []
const calc = () =>{
  const fraction = tokenDetails.amount / owners.length

  for(let i=0; i < owners.length; i++){
    array.push(ethers.utils.parseEther(`${fraction}`))
   }
   setAirdropAmount(array)
}
const airdrop = async() =>{
  try{
    calc()
    clean()
       
   
        const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const airdropContract = new ethers.Contract(BoonAddress, boonAbi.abi, signer);

    setLoading(true)
    const boon = await airdropContract.airdrop(tokenDetails.tokenAddress, nftList, airdropAmount)
    await boon.wait()
    setLoading(false)
    sucess()
    setLast(false)
  }catch(error){
    console.log(error)
    notify()
    setLoading(false)
  }
}

const approve = async()=>{

  try{
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const tokenContract = new ethers.Contract(tokenDetails.tokenAddress, tokenAbi.abi, signer);

    console.log("about to approve tokens........")
    const amount = ethers.utils.parseEther(tokenDetails.amount);
   
    const getUserToken = await tokenContract.approve(BoonAddress,amount )
    console.log("approving token............")
    setLoading(true)
    await getUserToken.wait()
    setLoading(true)
    console.log("yay, we are done")
    setApproved(true)
    setLoading(false)
    success()
      
    
    }catch(error){
      console.log(error)
     notify()
  }

}

const approveNft = async()=>{

  try{
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const tokenContract = new ethers.Contract(tokenDetails.tokenAddress, nftAbi.abi, signer);

    console.log("about to approve NFT........")
    const balance = await tokenContract.balanceOf(account)
    const cl = balance.toNumber()
    setBalance(cl)
    console.log(cl)
    const getUserToken = await tokenContract.setApprovalForAll(BoonAddress, true)
    
    console.log("approving NFT............")
    setLoading(true)
    await getUserToken.wait()
    setLoading(true)
    console.log("yay, we are done")
    setApproved(true)
    setLoading(false)
    success()
      
    
    }catch(error){
      console.log(error)
     notify()
  }

}
const clean = () =>{
  let newArray = owners.map(function(owner){
    return owner["owner"]})
  
    setNftList(newArray)
}
  

const handleSubmit = async(e) => {
  setLoading(true)
  await fetch('https://api.cybertino.io/connect/',{
    method:"POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({query: `{
      nftOwners(contract: "${tokenDetails.NftAddress}") {
        owner
         }
    }`})
  }).then(response => response.json())
  .then(data => setOwners(data.data.nftOwners))
  .catch( err => {
    console.log(err)
    invalid()
       
  })
  setLast(true)
  setLoading(false)
}


const handleOnChange = (e) => {
  setNetwork(e.target.value);
};

const handleAsset = (e) => {
  setNft(e.target.value);

  if(nft === "NFT"){
    setForm(false)
  }else {setForm(true)}
};

  function handleChange(event) {
    const {name, value} = event.target
    setTokenDetails(prev => ({
        ...prev,
        [name]: value
    }))
}
  
  return (
    
  <div className="gpt3__possibility section__padding" id="possibility">
    <div className="gpt3__possibility-image">
      <div className='input'>
      {approved ? "" : <div className="form">
      <label className="gradient__text">ASSET TYPE</label>
                <select className="form--input" value={nft} onChange={handleAsset}>
          <option value="selectAsset">Select Asset Type</option>
          <option value="NFT">NFT</option>
          <option value="TOKEN">TOKEN</option>
          </select>
      <label className="gradient__text">ADDRESS</label>
                <input 
                    type="text"
                    placeholder="Token Address"
                    required
                    maxLength="42"
                    minLength="42"
                    className="form--input"
                    name="tokenAddress"
                    value={tokenDetails.tokenAddress}
                    onChange={handleChange}
                />

               {form ? "" :<> <label className="gradient__text">AMOUNT</label>
                <input 
                    type="text"
                    placeholder="Amount to distribute"
                    required
                    
                    className="form--input"
                    name="amount"
                    value={tokenDetails.amount}
                    onChange={handleChange}
                /></>}
                <label className="gradient__text">NETWORK</label>
                <select className="form--input" value={network} onChange={handleOnChange}>
          <option value="selectNetwork">Select token Network</option>
          <option value="ERC20">ETHEREUM</option>
          <option value="BEP20">BINANCE SMARTCHAIN</option>
          <option value="BEP20">POLYGON</option>
          <option value="GOERLI">MUMBAI</option>
        </select>
      
                {form ? <button 
                    className="form--button"
                  onClick={approveNft}
                >
                 {loading? "Approving...." : "Approve"} 
                </button>:<button 
                    className="form--button"
                  onClick={approve}
                >
                 {loading? "Approving...." : "Approve"} 
                </button>}
            </div>}
            
      </div>
      {approved ? <div className='form'>
        {form ? <div>
          <h3 className='gradient__text'> You have granted approval to distribute your NFTs<br></br>
                                          Enter NFT contract address below to reward Holders</h3>
        </div> :<div>
          <h3 className='gradient__text'> You Have granted approval for {tokenDetails.amount} tokens<br></br>
                                          Enter NFT contract address below to reward Holders</h3>
        </div>}<div></div>
      {form? <label className="gradient__text">NFT Contract Address</label> : ""}
      {form ? <input 
                    type="text"
                    placeholder="Token Address"
                    required
                    maxLength="42"
                    minLength="42"
                    className="form--input"
                    name="NftAddress"
                    value={tokenDetails.NftAddress}
                    onChange={handleChange}
                /> : ""}
    <button className="form--button" onClick={handleSubmit} > 
 { loading ? "Getting NFT holders......." : "Get Holders"} 
</button>
    </div> : ""}
    
      </div>
    {last ? <div className="gpt3__possibility-content">
      <h1 className="gradient__text">{ form ? `Please upload the list of addresses you want to share your ${balance} NFTs with?`: `There are ${owners.length} addresses on this list <br /> Do you want to share ${tokenDetails.amount} tokens to all?`}</h1>
      {form ? "":<p>If not, please upload a custom list</p>}
      <div>
      {form? "":<button className="form--button" onClick={airdrop} >
      {loading ? "Sharing..........." : "Share To All"}
    </button>}
    <div>
    <div>
    <Input type="file" id="csvFile" accept=".csv" className="form--input" handleChange={handlecsv} />
    </div>
    {form ? <button className="form--button" onClick={airdropNft} >
    Upload Custom List
    </button>:<button className="form--button" onClick={upload} >
    Upload Custom List
    </button>}
    </div>
      </div>
    </div> : <div className="gpt3__possibility-content">
      <h1 className="gradient__text">Approve the airdrop <br /> amount to get started</h1>
      <p>Please ensure your token/NFT balance is greater than the approved amount and the appropriate network is selected</p>
      
    </div>}
    <ToastContainer />
  </div>
  
)};

export default Possibility;
