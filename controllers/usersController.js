const {
  Types: { ObjectId },
} = require("mongoose");
const User = require("../models/modelsUsers");
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);
const path = require("path");
const Avatar = require("avatar-builder");
const fs = require("fs").promises;
const { existsSync } =require( 'fs');

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
    const avatar = Avatar.builder(
      Avatar.Image.margin(
        Avatar.Image.roundedRectMask(
          Avatar.Image.compose(
            Avatar.Image.randomFillStyle(),
            Avatar.Image.shadow(Avatar.Image.margin(Avatar.Image.cat(), 8), {
              blur: 5,
              offsetX: 2.5,
              offsetY: -2.5,
              color: "rgba(0,0,0,0.75)",
            })
          ),
          32
        ),
        8
      ),
      128,
      128
    );
    avatar.create(body.email).then((buffer) => fs.writeFileSync("tmp/avatar.png", buffer));

    const nameAv = Date.now();
    fs.rename("tmp/avatar.png", `public/images/${nameAv}.png`);
    const hashedPassword = await bcrypt.hash(body.password, 10);
    const user = await User.create({
      ...body,
      password: hashedPassword,
      token: "",
      avatarURL: `http://localhost:8080/images/${nameAv}.png`,
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

  await User.findByIdAndUpdate(user._id, { token: token });

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

  const findUser = await User.findById(userId);

  if (!findUser) {
    return res.status(401).send("Not authorized");
  }

  await User.findByIdAndUpdate(userId, { token: "" });
  return res.status(204).send("No Content");
}

async function currentUser(req, res) {
  const { email, subscription } = req.user;

  return res.status(200).json({ email: email, subscription: subscription });
}

async function subNew(req, res) {
  const {
    params: { userid },
  } = req;
  const { subscription } = req.body;

  if (subscription === "free" || subscription === "pro" || subscription === "premium") {
    const newSub = await User.findByIdAndUpdate(userid, { subscription: subscription }, { new: true });
    return res.status(201).json({ email: newSub.email, subscription: newSub.subscription });
  }
}

async function newAvatar(req, res) {
  switch (true) {
    case !!req.body.password && !!req.file:
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      deleteAvatar(req.user.avatarURL);
      const updatedPasswordFile = await User.findByIdAndUpdate(
        req.user._id,
        { ...req.body, password: hashedPassword, avatarURL: `http://localhost:8080/images/${req.file.filename}` },
        { new: true }
      );
      return res.status(200).json({ avatarURL: `http://localhost:8080/images/${req.file.filename}` });

    case !!req.body.password:
      const hashedPasswor = await bcrypt.hash(req.body.password, 10);
      const updatedPassword = await User.findByIdAndUpdate(
        req.user._id,
        { ...req.body, password: hashedPasswor },
        { new: true }
      );
      return res.status(200).send("Data updated");

    case !!req.file:
      deleteAvatar(req.user.avatarURL);
      const updatedUrl = await User.findByIdAndUpdate(
        req.user._id,
        { ...req.body, avatarURL: `http://localhost:8080/images/${req.file.filename}` },
        { new: true }
      );
      return res.status(200).json({ avatarURL: `http://localhost:8080/images/${req.file.filename}` });

    default:
      const updatedUser = await User.findByIdAndUpdate(req.user._id, req.body, { new: true });
      return res.status(200).send("Data updated");
  }
}

function deleteAvatar(avatarURL) {
  const url = avatarURL.replace("http://localhost:8080/images/", "");

  if (existsSync(`public/images/${url}`)){
  fs.unlink(path.join("public/images", url));
  }
}

function updateValidationAv (req, res, next) {
  const validationRules = Joi.object({
    subscription: Joi.string().valid("free", "pro", "premium"),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
    password: Joi.string()
      .length(10)
      .pattern(/^[0-9]+$/),
  });
  const validationResult = validationRules.validate(req.body);
  console.log();
  if (validationResult.error) {
    return res.status(400).send({ message: "missing required name field" });
  }
  next();
}

module.exports = { newUser, validationUser, login, logoutUser, currentUser, subNew, newAvatar, updateValidationAv };
