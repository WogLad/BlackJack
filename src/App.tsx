import './App.css'
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

interface Card {
  digit: string;
  symbol: string;
}

function App() {
  const [dict, setDict] = useState< Card | null >(null);

  useEffect(() => {
    socket.on('dictionary', (data) => {
      setDict(data);
    });
  }, []);

  return (
    <div className="App">
      <div>
        {dict && (
          <div style={{fontWeight: "bolder"}}>
            <p>Digit: {dict.digit}</p>
            <p>Symbol: {dict.symbol}</p>
          </div>
        )}
      </div>
      
      <button style={{marginRight: "20px"}}>Hit</button>
      <button>Stay</button>

    </div>
  )
}

export default App
