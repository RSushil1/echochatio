const express= require('express');
const { Server } = require("socket.io");
const { parse } = require('url');
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




//routes
app.use("/api/socket", (req, res) => {
  const { query } = parse(req.url, true);
  const id = query.id;

  if (!id) {
    res.statusCode = 400;
    res.end('Missing "id" parameter in the query string');
    return;
  }

  const io = new Server({
    cors: {
      origin: "https://echochat.vercel.app",
      allowedHeaders: ["my-custom-header"],
      credentials: true
    }
  });

  io.on('connection', socket => {
    socket.join(id);
    console.log(id);

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

  io.listen(req, res)
});

//run listen
app.listen(PORT, () => {
  console.log(`Server Running on mode on port ${PORT}`);
});