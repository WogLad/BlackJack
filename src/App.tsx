import './App.css'
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

interface Card {
  digit: string;
  symbol: string;
}

function App() {
  const [card, setCard] = useState< Card | null >(null);
  const [personalScore, setPersonalScore] = useState<number | "STAYED" | "BUST">(0);
  const [isPlaying, setIsPlaying] = useState(true);

  socket.on('updateNewCard', (data) => {
    setCard(data);
  });

  socket.on("setScore", (score) => {
    if (score == -1) {
      setPersonalScore("BUST");
      setIsPlaying(false);
      return;
    }
    else if (score == 21) {
      setIsPlaying(false);
    }
    setPersonalScore(score);
  });

  return (
    <div className="App">
      {/* TODO: Design the component for the card */}
      <div>
        {card && (
          <div style={{fontWeight: "bolder"}}>
            <p>Digit: {card.digit}</p>
            <p>Symbol: {card.symbol}</p>
          </div>
        )}
      </div>
      
      <button disabled={!isPlaying} style={{marginRight: "20px"}} onClick={(e) => {if (isPlaying) {socket.emit("getNewCard");}}}>Hit</button>
      <button onClick={(e) => {socket.emit("turnEnd"); setPersonalScore("STAYED"); setIsPlaying(false);}}>Stay</button>

      <div>
        <p>Score: {personalScore}</p>
      </div>

    </div>
  )
}

export default App
