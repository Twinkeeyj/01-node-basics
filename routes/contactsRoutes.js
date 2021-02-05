const Router = require("express");
const logger = require("morgan");
const {
  getContacts,
  getContactsById,
  newContact,
  validateid,
  contactDelete,
  updateContact,
  validationContacts,
  updateValidationRules,
} = require("../controllers/contactsController.js");

const router = Router();

router.use(logger("dev"));

router.get("/", getContacts);
router.get("/:contactId", validateid, getContactsById);
router.post("/",validationContacts, newContact);
router.delete("/:contactId", validateid, contactDelete);
router.patch("/:contactId",  updateValidationRules, validateid, updateContact);

module.exports = router;
