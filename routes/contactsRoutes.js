const Router = require("express");
const logger = require("morgan");
const {
  getContacts,
  getContactsById,
  newContact,
  validateid,
  contactDelete,
  updateContact,
} = require("../controllers/contactsController.js");

const router = Router();

router.use(logger("dev"));

router.get("/", getContacts);
router.get("/:contactId", validateid, getContactsById);
router.post("/", newContact);
router.delete("/:contactId", validateid, contactDelete);
router.patch("/:contactId", validateid, updateContact);

module.exports = router;
