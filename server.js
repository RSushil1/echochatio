
const io = require ('socket.io')(5000)

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