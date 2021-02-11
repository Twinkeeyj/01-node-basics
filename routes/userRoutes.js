const Router = require("express");
const logger = require("morgan");
const {newUser,validationUser, login, logoutUser, currentUser} = require("../controllers/usersController");
const {auditToken}=require("../controllers/auth.controller")

const router = Router();

router.use(logger("dev"));

router.post("/register", validationUser, newUser);
router.post("/login", validationUser,login );
router.get("/logout/:userId",auditToken ,logoutUser);
router.get("/current", auditToken, currentUser );
;

module.exports = router;