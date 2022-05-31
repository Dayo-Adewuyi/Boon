import React from 'react';
  import ai from '../../assets/erc.png';
import './header.css';

const Header = () => (
  <div className="gpt3__header section__padding" id="home">
    <div className="gpt3__header-content">
      <h1 className="gradient__text">Boon lets you airdrop tokens to your favorite NFT holders </h1>
      <p>You no longer have to pay an arm and leg to share your favorite ERC20/BEP20 token to your NFT holders, Just "boon" it to them</p>

      <div className="gpt3__header-content__input">
      <a href="#possibility"><button type="button">Get Started</button></a>
      </div>

      <div className="gpt3__header-content__people">
       
      </div>
    </div>

    <div className="gpt3__header-image">
      <img src={ai} />
    </div>
  </div>
);

export default Header;
