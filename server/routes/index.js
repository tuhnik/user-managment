const secret = require('../middlewares/config.js').secret;
const tokenCheck = require("../middlewares").tokenCheck;
const express = require("express");
const validateEmail = require("email-validator").validate;
const jwt = require("jsonwebtoken");
const shortid = require("shortid");
const router = express.Router();
const bcrypt = require("bcrypt");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync("server/data/db.json");

const db = low(adapter);

db.defaults({ users: [] }).write();

router.post("/register", (req, res) => {
  let { email, password } = req.body;

  if (!validateEmail(email)) {
    return res.json({ error: "Invalid email" });
  }
  if (password.length < 8) {
    return res.json({ error: "Password should be at least 8 characters" });
  }
  if (checkRegistered(email)) {
    return res.json({ error: "E-mail already in use" });
  }

  password = bcrypt.hashSync(password, 10);

  db.get("users")
    .push({
      email,
      password,
      id: shortid.generate(),
      logins: []
    })
    .write();

  res.json({ message: "Registered successfully" });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  const user = db
    .get("users")
    .find({ email })
    .value();

  if (user) {
    if (!bcrypt.compareSync(password, user.password)) {
      return res.json({ error: "Wrong password" });
    }
    jwt.sign({ user }, secret, (err, token) => {
      if (err) {
        console.log(err);
      }
      res.json({ token, email: user.email });
    });

    const logins = db
      .get("users")
      .find({ email })
      .get("logins")
      .value();
    const date = new Date().toLocaleString("et-EE");
    logins.unshift(date);
    db.get("users")
      .find({ email })
      .assign({ logins })
      .write();
  } else {
    res.json({ error: "No such user" });
  }
});

router.post("/validate", tokenCheck, (req, res) => {
  const { email } = req.body;
  if (!checkRegistered(email)) {
    return res.json({ error: "No such user" });
  } else {
    res.json({ message: "Validated" });
  }
});

router.get("/users", tokenCheck, (req, res) => {
  let total = db.get("users").value().length
  let from = req.query.from || 0
  let to = req.query.to || total

  if(to > total) { to = total }
  if(from > total) {
    return res.json({error: "No users found"})
  }

  let data = db.get("users").value();

  data = data.slice(from, to)
  data = data.map(e => ({
    id: e.id,
    email: e.email,
    logins: e.logins.slice(0, 10)
  }));
   
  res.json({ data, total });
});

router.delete("/delete/:id", tokenCheck, (req, res) => {
  const id = req.params.id;
  if (!checkId(id)) {
    return res.json({ error: "Invalid ID" });
  }
  db.get("users")
    .remove({ id })
    .write();
  res.json({ message: "Successfully deleted" });
});

function checkRegistered(email) {
  const res = db
    .get("users")
    .find({ email })
    .value();
  return res;
}
function checkId(id) {
  const res = db
    .get("users")
    .find({ id })
    .value();
  return res;
}

module.exports = router;
