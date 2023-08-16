const { readFileSync } = require("fs");
const { createServer } = require("https");
const { Server } = require("socket.io");

const httpsServer = createServer({
  key: readFileSync("/path/to/my/key.pem"),
  cert: readFileSync("/path/to/my/cert.pem")
});

const io = new Server(httpsServer, {
    cors: {
        origin: "*",
        allowedHeaders: ["my-custom-header"],
        credentials: true
      }
});


io.on('connection', socket => {
    const id = socket.handshake.query.id;
    socket.join(id);
    console.log(id)
  
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


  httpServer.listen(5000, () => {
    console.log('Server Running on port 5000 for socket.io');
  });