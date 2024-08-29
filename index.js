const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const PORT = 3000;

app.use(cors());

// Replace with your actual MongoDB URI
const MONGODB_URI = "mongodb+srv://shivani:shivani@cluster0.cbiratc.mongodb.net/shivani?retryWrites=true&w=majority&appName=Cluster0";

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Define schema and model
const flipkartSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    product_name: String,
    product_category_tree: String,
    retail_price: Number,
    discounted_price: Number,
    image: [String],
    description: String,
    product_rating: String,
    brand: String,
    product_specifications: mongoose.Schema.Types.Mixed,
  },
  { collection: "flipcart" }
);

const Flipkart = mongoose.model("flipcart", flipkartSchema);

// Route for the root URL
app.get("/", (req, res) => {
  res.send("Server is running. Use /data to access data.");
});

// Route to get data in chunks of 20
app.get("/data", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 20;
  const skip = (page - 1) * limit;

  console.log(`Fetching data for page: ${page}`);

  try {
    const data = await Flipkart.find().skip(skip).limit(limit);
    console.log(`Fetched ${data.length} items`);
    res.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ message: "Error fetching data", error });
  }
});

// Start the server
const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

server.timeout = 300000; // 300000 milliseconds = 5 minutes
