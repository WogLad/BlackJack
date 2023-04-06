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

io.on('connection', (socket) => {
  console.log('A user connected.');

  // Send a dictionary to the client
  socket.emit('dictionary', getRandomCard());

  socket.on('disconnect', () => {
    console.log('A user disconnected.');
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}.`);
});
