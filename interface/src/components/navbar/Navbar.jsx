import { useState , useContext} from 'react'
import { RiMenu3Line, RiCloseLine } from 'react-icons/ri';
import truncateEthAddress from 'truncate-eth-address'
import './navbar.css';
import logo from '../../assets/boon.png';
import { ConnectContext } from '../../context/ConnectContext'


const Navbar = () => {
  const [toggleMenu, setToggleMenu] = useState(false);
  const {connectWallet, account, connectedWallet} = useContext(ConnectContext)


  return (
    <div className="gpt3__navbar">
      <div className="gpt3__navbar-links">
        <div className="gpt3__navbar-links_logo">
          <img src={logo} />
        </div>
        <div className="gpt3__navbar-links_container">
          <p><a href="#home">Home</a></p>
          <p><a href="https://github.com/Dayo-Adewuyi/Boon">What is Boon?</a></p>
          <p><a href="#possibility">Airdrop Token</a></p>
        </div>
      </div>
      <div className="gpt3__navbar-sign">
        <button type="button" onClick={connectWallet}>{connectedWallet ? `${truncateEthAddress(account)}` : "Connect Wallet"}</button>
      </div>
      <div className="gpt3__navbar-menu">
        {toggleMenu
          ? <RiCloseLine color="#fff" size={27} onClick={() => setToggleMenu(false)} />
          : <RiMenu3Line color="#fff" size={27} onClick={() => setToggleMenu(true)} />}
        {toggleMenu && (
        <div className="gpt3__navbar-menu_container scale-up-center">
          <div className="gpt3__navbar-menu_container-links">
            <p><a href="#home">Home</a></p>
            <p><a href="#features">What is Boon?</a></p>
            <p><a href="#possibility">Airdrop Tokens</a></p>
            </div>
          <div className="gpt3__navbar-menu_container-links-sign">
          <button type="button"></button>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
