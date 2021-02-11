const {
  Types: { ObjectId },
} = require("mongoose");
const User = require("../models/modelsUsers");
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

const session = require("express-session");

dotenv.config();

function validationUser(req, res, next) {
  const validationRules = Joi.object({
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
      .required(),
    password: Joi.string().required(),
  });
  const validationResult = validationRules.validate(req.body);
  if (validationResult.error) {
    return res.status(400).send(validationResult.error.message);
  }
  next();
}

async function newUser(req, res) {
  try {
    const { body } = req;
    const hashedPassword = await bcrypt.hash(body.password, 10);
    const user = await User.create({
      ...body,
      password: hashedPassword,
    });
    const { subscription, email } = user;
    res.status(201).json({
      user: {
        email: email,
        subscription: subscription,
      },
    });
  } catch (error) {
    res.status(409).send("Email in use");
  }
}

async function login(req, res) {
  const { email, password } = req.body;

  const user = await User.findOne({
    email,
  });

  if (!user) {
    return res.status(401).send("Email or password is wrong");
  }

  const paswordValid = await bcrypt.compare(password, user.password);

  if (!paswordValid) {
    return res.status(401).send("Email or password is wrong");
  }

  const token = jwt.sign(
    {
      userId: user._id,
    },
    process.env.TOKEN_SECRET
  );
  return res.status(200).json({
    token: token,
    user: {
      email: email,
      subscription: user.subscription,
    },
  });
}
async function logoutUser(req, res) {
  const {
    params: { userId },
  } = req;
  const authorizationHeader = req.get("Authorization");

  const findUser = await User.findById(userId);

  // req.user.deleteToken(req.token, (err, user) => {
  //   if (err) return res.status(400).send(err);
  //   res.sendStatus(200).send("юхууу");
  // });
  // console.log(token);
  if (!findUser) {
    return res.status(401).send("Not authorized");
  }

  authorizationHeader.replace(authorizationHeader, " ");
  return res.status(204).send("No Content");
}

// app.get("/api/logout", auth, function (req, res) {
//   req.user.deleteToken(req.token, (err, user) => {
//     if (err) return res.status(400).send(err);
//     res.sendStatus(200);
//   });
// });
async function currentUser(req, res) {
  console.log(req);
  const { email, subscription } = req.user;
  return res.status(200).json({
    email: email,
    subscription: subscription,
  });
}

module.exports = { newUser, validationUser, login, logoutUser, currentUser };
