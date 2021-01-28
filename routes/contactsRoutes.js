const Router = require("express");
const logger = require("morgan");
const {
  getContacts,
  getContactsById,
  newContact,
  validationContacts,
  contactDelete,
  updateContact,
  updateValidationRules
} = require("../controllers/contactsController.js");

const router = Router();

router.use(logger("dev"));

router.get("/", getContacts);
router.get("/:contactId", getContactsById);
router.post("/", validationContacts, newContact);
router.delete("/:contactId", contactDelete);
router.patch("/:contactId", updateValidationRules, updateContact);

module.exports = router;
