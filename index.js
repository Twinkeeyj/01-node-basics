const { listContacts, getContactById, removeContact, addContact } = require("./contacts.js");
const argv = require("yargs").argv;

function invokeAction({ action, id, name, email, phone }) {
  switch (action) {
    case "list":
      listContacts().then((el) => console.table(el));
      break;

    case "get":
      getContactById(id).then((el) => console.table(el));
      break;

    case "add":
      addContact(name, email, phone).then((el) => console.table(el));
      break;

    case "remove":
      removeContact(id).then((el) => console.table(el));
      break;

    default:
      console.warn("\x1B[31m Unknown action type!");
  }
}

invokeAction(argv);