const contacts = require("../db/contacts.json");
const Joi = require("joi");
const { v4: uuidv4 } = require("uuid");

const fs = require("fs").promises;
const path = require("path");
const contactsPath = path.join("./db/contacts.json");

function notFound(res, contactId) {
  const contact = contacts.find((contact) => contact.id === contactId);
  if (!contact) {
    return res.status(404).send({ message: "Not found" });
  }
}

function getContacts(req, res) {
  res.json(contacts);
}

function getContactsById(req, res) {
  const {
    params: { contactId },
  } = req;
  notFound(res, contactId);
  const contactIndex = contacts.findIndex((contact) => contact.id === contactId);
  res.json(contacts[contactIndex]);
}

function validationContacts(req, res, next) {
  const validationRules = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().required(),
  });
  const validationResult = validationRules.validate(req.body);
  if (validationResult.error) {
    return res.status(400).send({ message: "missing required name field" });
  }
  next();
}

function newContact(req, res) {
  const newContact = {
    id: uuidv4(),
    ...req.body,
  };
  contacts.push(newContact);
  fs.writeFile(contactsPath, JSON.stringify(contacts));
  res.status(201).send(newContact);
}

function contactDelete(req, res) {
  const {
    params: { contactId },
  } = req;
  notFound(res, contactId);
  const index = contacts.findIndex((contact) => contact.id === contactId);
  contacts.splice(index, 1);
  fs.writeFile(contactsPath, JSON.stringify(contacts));
  res.status(200).send({ message: "contact deleted" });
}

function updateValidationRules(req, res, next) {
  const validationRules = Joi.object({
    name: Joi.string(),
    email: Joi.string(),
    phone: Joi.string(),
  });
  const validationResult = validationRules.validate(req.body);
  if (validationResult.error) {
    return res.status(400).send({ message: "missing required name field" });
  }
  next();
}

function updateContact(req, res) {
  const {
    params: { contactId },
  } = req;
  notFound(res, contactId);
  const contactIndex = contacts.findIndex((contact) => contact.id === contactId);
  const updatedUser = {
    ...contacts[contactIndex],
    ...req.body,
  };
  contacts[contactIndex] = updatedUser;
  fs.writeFile(contactsPath, JSON.stringify(contacts));
  res.json(updatedUser);
}

module.exports = {
  getContacts,
  getContactsById,
  newContact,
  validationContacts,
  contactDelete,
  updateContact,
  updateValidationRules,
};
