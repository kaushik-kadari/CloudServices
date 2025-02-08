import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";
import { GridFSBucket } from "mongodb";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcrypt";

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


// MongoDB Connection
const mongoURI =
process.env.MONGO_URI || "mongodb://127.0.0.1:27017/mydatabase";
const conn = mongoose.createConnection(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = conn.model("User", userSchema);

let gfs, gridFSBucket;
conn.once("open", () => {
  gridFSBucket = new GridFSBucket(conn.db, { bucketName: "uploads" });
  gfs = gridFSBucket;
  console.log("MongoDB Connected");
});

// Multer GridFS Storage
const storage = new GridFsStorage({
  url: mongoURI,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    // console.log(file);
    return {
      filename: `${file.originalname}`,
      bucketName: "uploads",
      metadata: {
        name: file.originalname,
        type: file.mimetype,
        uploadDate: Date.now(),
      },
    };
  },
});
const upload = multer({ storage });

// Upload File
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "File upload failed" });
    }

    const files = await gfs.find({ filename: req.file.filename }).toArray();
    if (!files.length) {
      return res.status(404).json({ error: "File metadata not found" });
    }

    const file = files[0];

    res.json({
      id: file._id,
      name: file.filename.split(".")[0],
      type: file.filename.split(".")[1],
      size: file.length,
      uploadDate: file.metadata.uploadDate,
    });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get All Files
app.get("/files", async (req, res) => {
  const files = await gfs.find().toArray();
  const updatedfiles = files.map((file) => ({
    id: file._id,
    name: file.filename.split(".")[0],
    type: file.filename.split(".")[1],
    size: file.length,
    uploadDate: file.metadata.uploadDate,
  }));
  res.json(updatedfiles);
});

// Get Single File
app.get("/files/:id", async (req, res) => {
  const file = await gfs.find({ _id: new mongoose.Types.ObjectId(req.params.id) }).toArray();
  if (!file.length) return res.status(404).json({ error: "File not found" });

  res.json(file[0]);
});

// Download File
app.get("/download/:id", async (req, res) => {
  const file = await gfs
    .find({ _id: new mongoose.Types.ObjectId(req.params.id) })
    .toArray();
  if (!file) return res.status(404).json({ error: "File not found" });

  const readStream = gridFSBucket.openDownloadStream(file[0]._id);
  readStream.on("error", () => {
    res.status(404).json({ error: "File not found" });
  });
  res.attachment(file[0].filename);
  readStream.pipe(res);
});

// Delete File
app.delete("/delete/:id", async (req, res) => {
  try {
    await gfs.delete(new mongoose.Types.ObjectId(req.params.id));
    res.json({ message: "File deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "File deletion failed" });
  }
});

// sign up
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    res.json({ message: "Signup successful" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }
    res.json({ message: "Login successful", name: user.name });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
