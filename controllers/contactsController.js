const {
  Types: { ObjectId },
} = require("mongoose");
const Contact = require("../models/modelsContacs.js");
const Joi = require("joi");

function validateid(req, res, next) {
  const {
    params: { contactId },
  } = req;

  if (!ObjectId.isValid(contactId)) {
    return res.status(400).send("Your id is not valid");
  }

  next();
}
function validationContacts(req, res, next) {
  const validationRules = Joi.object({
    name: Joi.string(),
    email: Joi.string(),
    phone: Joi.string()

  });
  const validationResult = validationRules.validate(req.body);
  if (validationResult.error) {
    return res.status(400).send({ message: "missing required name field" });
  }
  next();
}
function updateValidationRules(req, res, next) {
  const validationRules = Joi.object({
    name: Joi.string(),
    email: Joi.string(),
    phone: Joi.string(),
  }).min(1);
  const validationResult = validationRules.validate(req.body);
  if (validationResult.error) {
    return res.status(400).send({ message: "missing required name field" });
  }
  next();
}

async function getContacts(req, res) {
  const contacts = await Contact.find();
  res.json(contacts);
}

async function getContactsById(req, res) {
  const {
    params: { contactId },
  } = req;

  const updatedUser = await Contact.findById(contactId, req.body, {
    new: true,
  });

  if (!updatedUser) {
    return res.status(400).send("User isn't found");
  }

  res.json(updatedUser);
}

async function newContact(req, res) {
  try {
    const { body } = req;
    const contact = await Contact.create(body);
    res.json(contact);
  } catch (error) {
    res.status(400).send(error);
  }
}

async function contactDelete(req, res) {
  const {
    params: { contactId },
  } = req;

  const deletedContact = await Contact.findByIdAndDelete(contactId);

  if (!deletedContact) {
    return res.status(400).send("User isn't found");
  }

  res.json(deletedContact);
}

async function updateContact(req, res) {
  const {
    params: { contactId },
  } = req;

  const updatedContact = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });

  if (!updatedContact) {
    return res.status(400).send("User isn't found");
  }

  res.json(updatedContact);
}

module.exports = {
  validateid,
  getContacts,
  getContactsById,
  newContact,
  contactDelete,
  updateContact,
  validationContacts,
  updateValidationRules,
};
