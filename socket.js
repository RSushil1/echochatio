const { Server } = require("socket.io");
const { parse } = require('url');

module.exports = (req, res) => {
  const { query } = parse(req.url, true);
  const id = query.id;

  if (!id) {
    res.statusCode = 400;
    res.end('Missing "id" parameter in the query string');
    return;
  }

  const io = new Server({
    cors: {
      origin: "*",
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

  io.listen(req, res);
};
