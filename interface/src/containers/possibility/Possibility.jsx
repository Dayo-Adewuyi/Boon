import React, {useState, useEffect, useContext} from 'react';
import './possibility.css';
import { ethers } from 'ethers';
import tokenAbi from '../../constants/abi.json'
import { BoonAddress } from '../../constants/constants';
import 'react-dropdown/style.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { ConnectContext } from "../../context/ConnectContext";
import boonAbi from "../../constants/boonAbi.json"


 
const Possibility = () => {
  const {account} = useContext(ConnectContext);
    const [nftList, setNftList] = useState([])
    const [airdropAmount, setAirdropAmount] = useState([])
    const [approved, setApproved] = useState(false)
    const [last, setLast] = useState(false)
    const [loading, setLoading] = useState(false)
    const [network, setNetwork] = useState('')
    const [owners, setOwners] = useState([])
   const [tokenDetails, setTokenDetails] = React.useState({
    tokenAddress: "",
    amount: "", 
    NftAddress:""
})
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
  );
  // mapping over the secondArr to get a distinct arr of rewards and returning it
  const values = secondArr.map((item) => {

    return item[1]; // [rewards]
  });
  //   console.log(JSON.stringify(values))
  //     console.log(JSON.stringify(address))
  // updating secondArr before returning
  secondArr = [address, values];  // secondArr=[[addresses],[rewards]]
  return secondArr;
};
// const ctt = document.getElementById("csvFile");
// ctt.onChange = function () {
//   console.log("hi");
// };
// function to handle uploading file and getting initial readings
function handleChange(e) {
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
const UploadSubmit = async (e) => {
  try{
  if (customerAddresses.length <= 200){
e.preventDefault();
await airdropTokens(customerAddresses, reward)
  setisFileUpload(false)
alert("succesfully sent reward")}
else { alert("only 200 addresses per batch")}
test()
  }
  catch(error){
    console.log(error)
   success()
  }

};


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
const invalid =() => toast.error("only NFTs on the Ethereum network is allowed")
const { ethereum } = window;
let array = []
const calc = () =>{
  const fraction = tokenDetails.amount / owners.length
  console.log(fraction)
  for(let i=0; i < owners.length; i++){
    array.push(fraction)
   }
   setAirdropAmount(array)
}
const airdrop = async() =>{
  try{
    calc()
    clean()
    console.log(nftList)
    console.log(airdropAmount)
        const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const airdropContract = new ethers.Contract(BoonAddress, boonAbi.abi, signer);

    setLoading(true)
    const boon = await airdropContract.airdrop(tokenDetails.tokenAddress, nftList,airdropAmount)
    await boon.wait()
    setLoading(false)
    success()
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
const clean = () =>{
  let newArray = owners.map(function(owner){
    return owner["owner"]})
  
    setNftList(newArray)
}
  

const handleSubmit = async(e) => {
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

}
console.log(owners)

const handleOnChange = (e) => {
  setNetwork(e.target.value);
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
      {approved ? `You have approved ${tokenDetails.amount} tokens` : <div className="form">
      <label className="gradient__text">TOKEN ADDRESS</label>
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
                <label className="gradient__text">AMOUNT</label>
                <input 
                    type="text"
                    placeholder="Amount to distribute"
                    required
                    
                    className="form--input"
                    name="amount"
                    value={tokenDetails.amount}
                    onChange={handleChange}
                />
                <label className="gradient__text">NETWORK</label>
                <select className="form--input" value={network} onChange={handleOnChange}>
          <option value="selectDreamCar">Select token Network</option>
          <option value="ERC20">ETHEREUM</option>
          <option value="BEP20">BINANCE SMARTCHAIN</option>
          <option value="GOERLI">GOERLI</option>
        </select>
      
                <button 
                    className="form--button"
                    onClick={approve}
                >
                 {loading? "Approving...." : "Approve"} 
                </button>
            </div>}
            
      </div>
      {approved ? <div className='form'>
        <div>
          <h3 className='gradient__text'> You Have granted approval for {tokenDetails.amount} tokens<br></br>
                                          Enter NFT contract address below to reward Holders</h3>
        </div><div></div>
      <label className="gradient__text">NFT Contract Address</label>
      <input 
                    type="text"
                    placeholder="Token Address"
                    required
                    maxLength="42"
                    minLength="42"
                    className="form--input"
                    name="NftAddress"
                    value={tokenDetails.NftAddress}
                    onChange={handleChange}
                />
    <button className="form--button" onClick={handleSubmit} >
  Get Holders
</button>
    </div> : ""}
    
      </div>
    {last ? <div className="gpt3__possibility-content">
      <h1 className="gradient__text">There are {owners.length} addresses on this list <br /> Do you want to share {tokenDetails.amount} tokens to all?</h1>
      <p>If not, please upload a custom list</p>
      <div>
      <button className="form--button" onClick={airdrop} >
      {loading ? "Sharing..........." : "Share To All"}
    </button>
    <button className="form--button" onClick={UploadSubmit} >
    Upload Custom List
    </button>
      </div>
    </div> : <div className="gpt3__possibility-content">
      <h1 className="gradient__text">Approve the airdrop <br /> amount to get started</h1>
      <p>Please ensure your token balance is greater than the approved amount and the appropriate network is selected</p>
      
    </div>}
    <ToastContainer />
  </div>
  
)};

export default Possibility;