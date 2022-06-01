import React from 'react';

import { Footer, Possibility, Header } from './containers';
import {  Navbar } from './components';
import { ConnectProvider } from './context/ConnectContext';

import './App.css';

const App = () => (
  <div className="App">
    <ConnectProvider>
      <Navbar />
      <Header />
     
    
    <Possibility />
    <Footer />
    
    </ConnectProvider>
  </div>
);

export default App;
