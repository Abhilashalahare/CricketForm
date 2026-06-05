import jwt from 'jsonwebtoken';
import express from 'express';
const router = express.Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  console.log("Login attempt for user:", username);

  if (!process.env.ADMIN_USER || !process.env.JWT_SECRET) {
    console.error("Missing server configuration!");
    return res.status(500).json({ error: "Server misconfiguration" });
  }

  if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASS) {
    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } else {
  
    res.status(401).json({ error: "Invalid credentials" });
  }
});

export default router;