const express= require('express');
const http = require ('http');
const { Server } = require("socket.io");
const cors= require("cors");


//PORT
const PORT = 5000;


//rest object
const app = express();


//middelwares
app.use(cors({
  origin: 'https://echochat.vercel.app',
  allowedHeaders: ["my-custom-header"],
      credentials: true
}));
app.use(express.json());



const server = http.createServer(app); // Create HTTP server instance

const io = new Server(server, {
  cors: {
    origin: 'https://echochat.vercel.app',
    methods: ['GET', 'POST'],
    allowedHeaders: ['my-custom-header'],
    credentials: true
  }
}); // Pass the HTTP server instance to the Socket.IO Server

io.on('connection', socket => {
  const id = socket.handshake.query.id;
  socket.join(id);
  
  socket.on('send-message', ({ recipients, text }) => {
      recipients.forEach(recipient => {
          const newRecipients = recipients.filter(r => r !== recipient);
          newRecipients.push(id);
          io.to(recipient).emit('receive-message', {
              recipients: newRecipients,
              sender: id,
              content: text,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          });
      });
  });
});

//run listen
server.listen(PORT, () => {
  console.log(`Server Running on mode on port ${PORT}`);
});