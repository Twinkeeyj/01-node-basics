const express = require("express");
const path = require('path')
const router = express();
const fs=require('fs')


router.use(express.static(path.join("public/images")))

module.exports = router
