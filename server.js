import express from "express";
import cors from "cors";
import qr from "qr-image";
import fs from "fs";
import { error } from "console";

const app = express();
const PORT = 5000;

// middleware
app.use(cors());
app.use(express.json());

// endpoin generate QR
app.post("/generate", (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }
  // Simpan URL ke file
  fs.writeFile("urls.txt", url + "\n", { flag: "a" }, (err) => {
    if (err) console.error(err);
  });

  // Generate QR Code sebagai buffer
  const qr_svg = qr.imageSync(url, { type: "png" });
  const qrBase64 = Buffer.from(qr_svg).toString("base64");

  // Kirim Base64 ke frontend
  res.json({ qrCode: `data:image/png;base64,${qrBase64}` });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
