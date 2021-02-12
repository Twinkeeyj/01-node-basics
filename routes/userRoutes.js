const Router = require("express");
const logger = require("morgan");
const {newUser,validationUser, login, logoutUser, currentUser, subNew} = require("../controllers/usersController");
const {auditToken}=require("../controllers/auth.controller")

const router = Router();

router.use(logger("dev"));

router.post("/register", validationUser, newUser);
router.post("/login", login );
router.get("/logout/:userId",auditToken ,logoutUser);
router.get("/current",  currentUser );
router.patch("/user/:userid",  subNew );
;

module.exports = router;