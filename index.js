const express = require("express");
const cors = require("cors");
const contactsRouter = require("./routes/contactsRoutes.js");
const { listContacts, getContactById, removeContact, addContact } = require("./contacts.js");

const PORT = process.env.port || 8080;

class Server {
  start() {
    this.server = express();
    this.initMiddlewares();
    this.initRoutes();
    this.listen();
  }
  initMiddlewares() {
    this.server.use(express.json());
    this.server.use(
        cors({
            origin: '*',
        })
    );
}
initRoutes() {
  this.server.use('/api/contacts', contactsRouter);
}
listen() {
  this.server.listen(PORT, () => {
    console.log('Server is listening on port: ', PORT);
});
}
}
const server = new Server();
server.start();
