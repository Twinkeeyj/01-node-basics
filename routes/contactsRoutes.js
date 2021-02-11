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
  getContactsPage,
  getContactsSub
} = require("../controllers/contactsController.js");
const {auditToken}=require("../controllers/auth.controller")

const router = Router();

router.use(logger("dev"));
// ______
router.get("/sub=:sub", getContactsSub);
router.get("/page=:page&limit=:limit", getContactsPage);
// ________
router.get("/",auditToken, getContacts);
router.get("/:contactId",auditToken, validateid, getContactsById);
router.post("/",auditToken, newContact);
router.delete("/:contactId",auditToken, validateid, contactDelete);
router.patch("/:contactId",auditToken,  updateValidationRules, validateid, updateContact);
module.exports = router;
