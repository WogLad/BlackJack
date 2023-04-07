import './App.css'
import React, { useState } from 'react';
import io from 'socket.io-client';
import { CardComponent } from './Card';

const socket = io('http://localhost:3000');

export interface Card {
  digit: string;
  symbol: string;
}

function App() {
  const [card, setCard] = useState< Card | null >(null);
  const [personalScore, setPersonalScore] = useState<number | "STAYED" | "BUST">(0);
  const [isPlaying, setIsPlaying] = useState(true);

  socket.on('updateNewCard', (data: Card) => {
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
      {/* DONE: Design the component for the card */}
      {card && (
        <CardComponent digit={card.digit} symbol={card.symbol} />
      )}
      
      <button disabled={!isPlaying} style={{marginRight: "20px"}} onClick={(e) => {if (isPlaying) {socket.emit("getNewCard");}}}>Hit</button>
      <button onClick={(e) => {socket.emit("turnEnd"); setPersonalScore("STAYED"); setIsPlaying(false);}}>Stay</button>

      <div>
        <p>Score: {personalScore}</p>
      </div>

    </div>
  )
}

export default App
