const Router = require("express");
const logger = require("morgan");
const {
  getContacts,
  getContactsById,
  newContact,
  validateid,
  contactDelete,
  updateContact,
  updateValidationRules,
} = require("../controllers/contactsController.js");
const {auditToken}=require("../controllers/auth.controller")

const router = Router();

router.use(logger("dev"));

router.get("/",auditToken, getContacts);
router.get("/:contactId",auditToken, validateid, getContactsById);
router.post("/",auditToken, newContact);
router.delete("/:contactId",auditToken, validateid, contactDelete);
router.patch("/:contactId",auditToken,  updateValidationRules, validateid, updateContact);

module.exports = router;
