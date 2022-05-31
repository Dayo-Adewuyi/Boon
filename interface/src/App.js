import React from 'react';

import { Footer, Possibility, Features, WhatGPT3, Header } from './containers';
import { CTA, Brand, Navbar } from './components';
import { ConnectProvider } from './context/ConnectContext';

import './App.css';

const App = () => (
  <div className="App">
    <ConnectProvider>
      <Navbar />
      <Header />
    
    <Brand />
    <WhatGPT3 />
    <Features />
    <Possibility />
    <CTA />
    <Footer />
    </ConnectProvider>
  </div>
);

export default App;
