const express = require("express");

const events = require("./controllers/events");

const router = express.Router();


router.get("/", (req, res) => {
    res.json({ success: "API Entry Point" })
});

router.use("/events", events);


module.exports = router;