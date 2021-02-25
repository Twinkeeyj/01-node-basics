const Router = require("express");
const logger = require("morgan");
const {
  newUser,
  validationUser,
  login,
  logoutUser,
  currentUser,
  subNew,
  newAvatar,
  updateValidationAv,
  confirmationEmail
} = require("../controllers/usersController");
const { auditToken } = require("../controllers/auth.controller");

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");

  },
  filename: function (req, file, cb) {
    const { ext } = path.parse(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});

const upload = multer({ storage });

const router = Router();
router.use(logger("dev"));

router.post("/register", validationUser, newUser);
router.post("/login", login);
router.get("/logout/:userId", auditToken, logoutUser);
router.get("/current", auditToken, currentUser);
router.patch("/user/:userid", auditToken, subNew);
router.patch("/users/avatars", auditToken, upload.single("avatar"),updateValidationAv, newAvatar);
router.get("/verify/:verificationToken", confirmationEmail)

module.exports = router;
