// pages/api/secret.js

import jwt from "jsonwebtoken";

export default function handler(req, res) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1]; // Format: Bearer token

  if (!token) {
    return res.status(401).json({ message: "Token tidak ditemukan" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Lanjutkan logika jika perlu
    res.status(200).json({
      message: `Hai ${decoded.email}, ini data API rahasia 🎉`,
    });
  } catch (err) {
    res.status(401).json({ message: "Token tidak valid atau expired" });
  }
}
