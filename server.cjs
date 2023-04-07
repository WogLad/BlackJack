const http = require('http');
const server = http.createServer();

const io = require('socket.io')(server, {
  cors: {
    origin: '*'
  }
});

function getRandomCard() {
  const symbols = ['h', 'd', 's', 'c'];
  const digits = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'j', 'q', 'k', 'a'];

  const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
  const randomDigit = digits[Math.floor(Math.random() * digits.length)];

  return { symbol: randomSymbol, digit: randomDigit };
}

const players = {/* {playerSocketID: {username, currentRoundPoints}} */};

const digitToScore = {
  "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9, "10": 10, "j": 10, "q": 10, "k": 10, "a": 1,
};

io.on('connection', (socket) => {
  players[socket.id] = {username: "", score: 0};

  socket.on("setUsername", (username) => {
    players[socket.id].username = username;
    console.log(`${username} connected.`);
  });

  socket.on("getNewCard", () => {
    const randomCard = getRandomCard();
    socket.emit('updateNewCard', randomCard);

    if (randomCard.digit == "a" && ((21 - players[socket.id].score) >= 11)) {
      players[socket.id].score += 11;
    }
    else {
      players[socket.id].score += digitToScore[randomCard.digit];
    }

    if (players[socket.id].score > 21) {
      players[socket.id].score = -1;
    }
    
    socket.emit("setScore", players[socket.id].score);
  });

  socket.on("getPlayerScores", () => {
    var playerScores = {};
    for (var i in players) {
      playerScores[players[i].username] = players[i].score
    }
    socket.emit("setPlayerScores", playerScores);
  });

  socket.on("turnEnd", () => {
    // console.log(`The player ended his turn with a score of ${players[socket.id]}.`);
    console.log(players);
  });

  socket.on("restartGame", () => {
    for (var i in players) {
      players[i].score = 0;
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected.');
    delete players[socket.id];
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}.`);
});
