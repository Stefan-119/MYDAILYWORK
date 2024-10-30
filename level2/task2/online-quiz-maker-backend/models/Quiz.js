const mongoose = require("mongoose");

const QuizSchema = new mongoose.Schema({
  title: String,
  topic: String,
  questions: [
    {
      questionText: String,
      options: [{ text: String, isCorrect: Boolean }],
    },
  ],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Quiz", QuizSchema);
