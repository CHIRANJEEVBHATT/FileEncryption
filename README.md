🔐 File Encryption & Decryption Tool (AES + RSA)

This project is a File Encryption & Decryption Web Application built with the MERN stack.
It allows users to upload any file (e.g., PNG, JPG, PDF, TXT), encrypt it securely with AES (Advanced Encryption Standard), and protect the AES key using RSA (Rivest–Shamir–Adleman) public-key cryptography.

The encrypted file can later be decrypted back to the original file using the encrypted AES key and IV.

🚀 Features

🔒 AES-256-CBC encryption for files (fast + secure).

🔑 RSA encryption of AES key for key security.

📂 Supports any file type (images, documents, etc.).

⬆️ Upload + encrypt files directly from frontend.

⬇️ Download encrypted or decrypted files.

✅ Ensures decrypted file is exactly the same as the original.

📂 Project Structure
fileEncryption/
│
├── server/                 # Backend (Node.js + Express)
│   ├── config/
│   │   └── keys/           # RSA key pairs (public.pem, private.pem)
│   ├── controllers/
│   │   └── fileController.js   # Encryption/Decryption logic
│   ├── routes/
│   │   └── fileRoutes.js       # API routes
│   ├── uploads/            # Temporary uploads
│   ├── outputs/            # Encrypted & decrypted files
│   └── server.js           # Express server entry point
│
├── client/                 # Frontend (React + Vite)
│   ├── src/
│   │   ├── App.js          # React routes
│   │   ├── components/     # Upload/Decrypt UI
│   │   └── api/            # Axios calls to backend
│   └── index.html
│
└── README.md               # Project documentation

⚙️ Setup & Installation
1. Clone the repository
git clone https://github.com/your-username/fileEncryption.git
cd fileEncryption

2. Backend Setup
cd server
npm install

Generate RSA Keys

Make sure you have RSA key pairs inside server/config/keys:

# Generate private key
openssl genrsa -out config/keys/private.pem 2048

# Generate public key from private key
openssl rsa -in config/keys/private.pem -pubout -out config/keys/public.pem

Run Backend
npm start


(Default runs on http://localhost:5000)

3. Frontend Setup
cd client
npm install
npm run dev


(Default runs on http://localhost:5173)

🔄 Workflow
🔐 Encryption

Upload a file (e.g., image.png)

Backend generates:

Encrypted file → outputs/{timestamp}_image.png.enc

Encrypted AES key (base64 string)

IV (base64 string)

You can download .enc file + copy AES key + IV

🔓 Decryption

Upload the encrypted .enc file

Provide the encrypted AES key + IV

Backend decrypts using RSA private key + AES key

Decrypted file is saved in outputs/decrypted_{timestamp}_image.png

File is same as original ✅

🛠️ Technologies Used

Frontend: React (Vite), Axios, TailwindCSS

Backend: Node.js, Express, Multer, Crypto

Cryptography:

AES-256-CBC for file encryption

RSA-2048 for AES key encryption

📸 Demo (for Presentation)

Upload → myFile.png

Download → myFile.png.enc + AES key + IV

Upload .enc + AES key + IV → get back myFile.png

Open → file is identical to original ✅

📌 Notes

Keep your RSA private key safe – losing it means files cannot be decrypted.

Encrypted files are meaningless without both:

Encrypted AES key

IV

Works with any file type: Images, PDFs, ZIPs, etc.
