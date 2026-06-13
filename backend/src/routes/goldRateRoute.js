const goldRateController = require("../controllers/goldRateController");
const express = require("express");
const router = express.Router();

router.post("/set", goldRateController.setGoldRate);
router.get("/latest", goldRateController.getLatestGoldRate);
router.get("/date/:date", goldRateController.getGoldRateByDate);

module.exports = router;