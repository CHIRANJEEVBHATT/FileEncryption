import crypto from "crypto";
import fs from "fs";
import path from "path";

// Create keys folder if it doesn't exist
const keysDir = path.join(process.cwd(), "config", "keys");
if (!fs.existsSync(keysDir)) {
  fs.mkdirSync(keysDir, { recursive: true });
}

// Generate RSA key pair
const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 2048,
});

// Save private key
fs.writeFileSync(
  path.join(keysDir, "private.pem"),
  privateKey.export({
    type: "pkcs1",
    format: "pem",
  })
);

// Save public key
fs.writeFileSync(
  path.join(keysDir, "public.pem"),
  publicKey.export({
    type: "pkcs1",
    format: "pem",
  })
);

console.log("✅ RSA keys generated successfully!");
console.log("Private Key: config/keys/private.pem");
console.log("Public Key: config/keys/public.pem");
