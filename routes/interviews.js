const express = require("express");
const router = express.Router();

const interviewController = require("../controllers/interviews_controller");

router.get("/add-interview", interviewController.addInterview);

router.post("/create", interviewController.create);

router.get("/destroy/:interviewId", interviewController.destroy);

router.post("/enroll-in-interview/:id", interviewController.enrollInInterview);

router.post("/evaluate-interview/:id", interviewController.evaluateInInterview);

router.get("/deallocate/:studentId/:interviewId", interviewController.deallocate);

module.exports = router;
