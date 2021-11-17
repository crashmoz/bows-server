const UserSchema = require("../models/User");
const multer = require("multer");
const fs = require("fs");
const { pathToFileURL } = require("url");
const path = require("path");
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./images/avatar/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});
var upload = multer({ storage: storage });

module.exports.controller = (app) => {
  // fetch all users
  app.get("/users", (req, res) => {
    UserSchema.find(
      {},
      "name username email gender role avatar",
      (err, user) => {
        if (err) {
          console.log(err);
        }
        res.send({ user });
      }
    );
  });

  app.get("/ava/:name", (req, res) => {
    var name = req.params.name;
    res.sendFile("./images/avatar/" + name, { root: "." });
  });

  // add new user
  app.post("/users", upload.single("avatar"), (req, res) => {
    const newUser = new UserSchema({
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      gender: req.body.gender,
      password: req.body.password,
      avatar: req.file.filename,
      role: req.body.role,
    });
    UserSchema.createUser(newUser, (err, user) => {
      if (err) {
        res.status(422).json({
          message: "Something went wrong. Please try again!",
        });
      }
      res.status(200).send({ user });
    });
  });

  app.put("/users", upload.single("avatar"), (req, res) => {
    let ava = "";
    if (req.file) {
      ava = req.file.filename;
    } else {
      ava = req.body.avatar;
    }
    const user = {
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      gender: req.body.gender,
      password: req.body.password,
      avatar: ava,
      role: req.body.role,
    };
    UserSchema.findByIdAndUpdate(req.body._id, user)
      .then(() => {
        res.send(user);
      })
      .catch((err) => {
        if (err.kind === "ObjectId") {
          return res.status(404).send({
            message: "User not found with id " + req.body._id,
          });
        }
        res.status(500).send({
          message: "Error updating user with id " + req.body._id,
        });
      });
  });

  app.delete("/users/:id", (req, res) => {
    var id = req.params.id;
    UserSchema.findByIdAndDelete(id, (err, val) => {
      const imgpath = path.resolve("./images/avatar/" + val.avatar + ".jpg");
      if (err) {
        res.status(422).json({
          message: "failed delete data",
        });
      } else {
        fs.unlink("./images/avatar/" + val.avatar, (err) => {
          if (err) {
            console.log(err);
            res.status(422).json({
              message: err,
            });
          } else {
            res.status(200).json({
              message: "Data has successful deleted .",
            });
          }
        });
      }
    });
  });
};
