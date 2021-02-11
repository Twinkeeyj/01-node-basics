const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const contactsRouter = require("./routes/contactsRoutes.js");
const usersRouter=require("./routes/userRoutes")

dotenv.config();
const PORT = process.env.port || 8080;

class Server {
  start() {
    this.server = express();
    this.initMiddlewares();
    this.initRoutes();
    this.listen();
    this.connectToDb();
  }
  initMiddlewares() {
    this.server.use(express.json());
    this.server.use(
      cors({
        origin: "*",
      })
    );
  }
  initRoutes() {
    this.server.use("/api/contacts", contactsRouter);
    this.server.use("/auth", usersRouter)
  }
  async connectToDb() {
    try {
      await mongoose.connect(process.env.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      });
      console.log("Database connection successful");
    } catch (error) {
      console.log(error.message);
      process.exit(1);
    }
  }
  listen() {
    this.server.listen(PORT, () => {
      console.log("Server is listening on port: ", PORT);
    });
  }
}
const server = new Server();
server.start();
