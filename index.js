const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const fs = require("fs");
const session = require("express-session");
const cookieSession = require("cookie-session");
const passport = require("passport");
require("dotenv").config();

const app = express();
const router = express.Router();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/images", express.static("public"));

// Set CORS
const corsOption = {
  origin: ["http://localhost:3000", "http://192.168.1.16:3000"],
  credentials: true,
};
app.use(cors(corsOption));
// app.use(cors());

// Set Session
app.use(
  session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {
      httpOnly: false,
      // sameSite: 'None', 
      // secure: true 
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// connect to mongodb
mongoose
  .connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log("Connection has been made"))
  .catch((err) => {
    console.log("App starting error:", err.stack);
    process.exit(1);
  });

// #########################  ADD FOR SOCKET IO   #####################################
const httpServer = require("http").createServer(app)
const io = require("socket.io")(httpServer, {
  cors: {
    origin: "http://localhost:3000",
  }
});

// io.on("connection", (socket) => {
//     // console.log(socket.id)
//     socket.on('order added', () => {
//       console.log('dalem')
//       // io.emit('refresh order feed', data)
//     })
// });
// io.on('order added', (data) => {
//   console.log(data)
//   io.emit('refresh order feed', data)
// })

//  ###################################################################################
// include controllers
fs.readdirSync("controllers").forEach((file) => {
  if (file.substr(-3) == ".js") {
    const route = require("./controllers/" + file);
    route.controller(app, io);
  }
});

router.get("/", (req, res) => {
  res.json({ message: "API Initialized" });
});
app.use("/", router);

//  ##########################  PUSHER  ###########################################


const Pusher = require("pusher");

const pusher = new Pusher({
  appId: "1239917",
  key: "5a10d15736489c709a2f",
  secret: "2dee601715694c2834a5",
  cluster: "ap1",
  useTLS: true
});

pusher.trigger("my-channel", "my-test", {
  message: "hello worlds"
});

app.post('/test_pusher', (req, res) => {
  console.log(req.body)
  pusher.trigger('my-channel', 'test-push', { message: req.body.text });
  res.status(200).send();
});

//  ################################################################################

const port = 5000;
// app.use("/", router);
httpServer.listen(port, () => {
  console.log(`API running on port ${port}`);
});
