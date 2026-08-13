const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const mongoUri =
  process.env.MONGO_URI || "mongodb://mongodb:27017/portfolio";

mongoose
  .connect(mongoUri)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((error) => console.error("MongoDB connection error:", error));

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Contact = mongoose.model("Contact", contactSchema);

app.get("/", (req, res) => {
  res.send("Portfolio Backend API is running");
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Backend is healthy"
  });
});

app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        message: "Name, email and message are required"
      });
    }

    const contact = new Contact({
      name,
      email,
      message
    });

    await contact.save();

    res.status(201).json({
      message: "Message saved successfully"
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal server error"
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend server running on port ${PORT}`);
});
