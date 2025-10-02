import express from "express";
import multer from "multer";
import { encryptFile, decryptFile } from "../controllers/fileController.js";
// import { encryptFile, decryptFile } from "../controllers/fileController.js";


const router = express.Router();
const upload = multer({ dest: "uploads/" }); // store uploads temporarily

// Encrypt file
router.post("/encrypt", upload.single("file"), encryptFile);

// Decrypt file
router.post("/decrypt", upload.single("file"), decryptFile);

export default router;
