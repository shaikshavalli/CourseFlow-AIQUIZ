import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";
import dotenv from "dotenv";
dotenv.config();

const mongoURI = process.env.MONGO_URI;

const storage = new GridFsStorage({
  url: mongoURI,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => ({
    filename: `${Date.now()}-${file.originalname}`,
    bucketName: "uploads",
  }),
});

const upload = multer({ storage });
export default upload;
