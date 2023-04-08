import './App.css'
import React, { useState } from 'react';
import io from 'socket.io-client';
import { CardComponent } from './Card';

const socket = io(`http://${location.hostname}:3000`);

const username = prompt("Enter your name")?.trim();
socket.emit("setUsername", username);

export interface Card {
  digit: string;
  symbol: string;
}

function App() {
  const [card, setCard] = useState< Card | null >(null);
  const [personalScore, setPersonalScore] = useState<number | "STAYED" | "BUST">(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [playerScoresText, setPlayerScoresText] = useState("");

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

  socket.on("setPlayerScores", (scores) => {
    var text: string = "";
    var i = 1;
    for (var username in scores) {
      text += `${i}. ${username} - ${scores[username]}\n`;
      i++;
    }
    (document.getElementById("scoreboardText") as HTMLDivElement).innerText = text;
  });

  return (
    <div className="App">
      <div hidden={!isPlaying} id='game'>
        {/* DONE: Design the component for the card */}
        {card && (
          <CardComponent digit={card.digit} symbol={card.symbol} />
        )}
        
        <button style={{marginRight: "20px"}} onClick={(e) => {if (isPlaying) {socket.emit("getNewCard"); socket.emit("getPlayerScores");}}}>Hit</button>
        <button onClick={(e) => {socket.emit("turnEnd"); setPersonalScore("STAYED"); setIsPlaying(false); socket.emit("getPlayerScores");}}>Stay</button>

        <div>
          <p>Score: {personalScore}</p>
        </div>
      </div>

      <div hidden={isPlaying} id='scoreboard' style={{
        width: "450px",
        height: "700px",
        backgroundColor: "#2f2f2f",
        borderRadius: "0.75rem",
        boxShadow: "0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)",
        padding: "8px"
      }}>
        <h1 style={{fontWeight: "bolder"}}><u>Scoreboard</u></h1>
        
        <div id='scoreboardText' style={{overflow: "scroll", height: "80%", width: "95%", margin: "auto", fontWeight: "bold", fontSize: "1.3rem", textAlign: "left", marginLeft: "0 20px"}}></div>
      </div>
    </div>
  )
}

export default App
