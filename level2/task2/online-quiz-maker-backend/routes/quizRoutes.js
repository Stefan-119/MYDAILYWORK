const express = require("express");
const Quiz = require("../models/Quiz");
const authMiddleware = require("../middleware/authMiddleware"); // Middleware for authentication

const router = express.Router();

// Create a new quiz
// Create a new quiz
router.post("/", authMiddleware, async (req, res) => {
  const { title, topic, questions } = req.body;
  try {
    const quiz = new Quiz({
      title,
      topic,
      questions,
      createdBy: req.user.id, // Assuming you have user info in req.user
    });
    await quiz.save();
    res.status(201).json(quiz);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all quizzes
router.get("/", authMiddleware, async (req, res) => {
  try {
    const quizzes = await Quiz.find({ createdBy: req.user.id });
    res.status(200).json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific quiz
router.get("/:id", async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Submit answers and calculate score
router.post("/:id/submit", async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    const { answers } = req.body;
    let score = 0;
    const correctAnswers = [];

    quiz.questions.forEach((question, index) => {
      const correctOption = question.options.find(
        (option) => option.isCorrect
      )?.text;
      if (answers[index] === correctOption) {
        score += 1;
      }
      correctAnswers.push(correctOption);
    });

    res.json({ score, correctAnswers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
