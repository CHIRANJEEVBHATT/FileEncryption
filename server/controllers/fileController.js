import fs from "fs";
import path from "path";
import crypto from "crypto";

// Load RSA keys
const publicKey = fs.readFileSync(
  path.join(process.cwd(), "config", "keys", "public.pem"),
  "utf8"
);
const privateKey = fs.readFileSync(
  path.join(process.cwd(), "config", "keys", "private.pem"),
  "utf8"
);

// AES settings
const algorithm = "aes-256-cbc";

export const encryptFile = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const outputsDir = path.join(process.cwd(), "outputs");
    if (!fs.existsSync(outputsDir)) {
      fs.mkdirSync(outputsDir, { recursive: true });
    }

    const filePath = req.file.path;
    const fileData = fs.readFileSync(filePath);

    // Generate AES key + IV
    const aesKey = crypto.randomBytes(32); // 256-bit AES key
    const iv = crypto.randomBytes(16);

    // Encrypt file with AES
    const cipher = crypto.createCipheriv(algorithm, aesKey, iv);
    const encryptedData = Buffer.concat([cipher.update(fileData), cipher.final()]);

    // Encrypt AES key with RSA public key (default padding)
    const encryptedAesKey = crypto.publicEncrypt(publicKey, aesKey);

    // Save encrypted file
    const outPath = path.join(outputsDir, `${Date.now()}_${req.file.originalname}.enc`);
    fs.writeFileSync(outPath, encryptedData);

    res.json({
      message: "File encrypted successfully",
      encryptedFilePath: outPath,
      encryptedAesKey: encryptedAesKey.toString("base64"),
      iv: iv.toString("base64"),
    });
  } catch (error) {
    console.error("Encryption Error:", error);
    res.status(500).json({ error: "Encryption failed", details: error.message });
  }
};

export const decryptFile = (req, res) => {
  try {
    const { encryptedAesKey, iv } = req.body;

    console.log("Decrypt request received");
    console.log("encryptedAesKey:", encryptedAesKey);
    console.log("iv:", iv);
    console.log("file:", req.file);

    if (!req.file || !encryptedAesKey || !iv) {
      return res.status(400).json({ error: "Missing file, AES key, or IV" });
    }

    const outputsDir = path.join(process.cwd(), "outputs");
    if (!fs.existsSync(outputsDir)) {
      fs.mkdirSync(outputsDir, { recursive: true });
    }

    const filePath = req.file.path;
    const encryptedData = fs.readFileSync(filePath);

    // Decrypt AES key with RSA private key (default padding)
    let aesKey;
    try {
      aesKey = crypto.privateDecrypt(
        privateKey,
        Buffer.from(encryptedAesKey, "base64")
      );
    } catch (err) {
      console.error("AES Key decryption failed:", err);
      return res.status(400).json({ error: "Invalid AES key", details: err.message });
    }

    console.log("AES key length:", aesKey.length);

    // Decrypt file with AES
    let decryptedData;
    try {
      const decipher = crypto.createDecipheriv(
        algorithm,
        aesKey,
        Buffer.from(iv, "base64")
      );
      decryptedData = Buffer.concat([decipher.update(encryptedData), decipher.final()]);
    } catch (err) {
      console.error("AES decryption failed:", err);
      return res.status(500).json({ error: "AES decryption failed", details: err.message });
    }

    // Save decrypted file
    const originalName = req.file.originalname.replace(/\.enc$/, "");
    const outPath = path.join(outputsDir, `decrypted_${Date.now()}_${originalName}`);
    fs.writeFileSync(outPath, decryptedData);

    console.log("Decryption successful:", outPath);
    res.json({
      message: "File decrypted successfully",
      decryptedFilePath: outPath,
    });
  } catch (error) {
    console.error("Decryption Error:", error);
    res.status(500).json({ error: "Decryption failed", details: error.message });
  }
};
