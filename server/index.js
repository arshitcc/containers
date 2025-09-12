import express from "express";
import { Pool } from "pg";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json())

const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  database: process.env.DB_NAME || "postgres",
  host: process.env.DB_HOST || "database",
  password: process.env.DB_PASSWORD || "password",
  port: process.env.DB_PORT || 5432,
});

app
  .route("/")
  .get((req, res) => {
    console.log(`Welcome to the Server 🙏 !!`);
    res.status(200).send(`Welcome to the Server 🙏 !!`);
  })
  .post((req, res) => {
    const { name } = req.body;
    let bigName = true;
    if (!name || !(name?.length >= 6)) {
      bigName = false;
    }
    res.status(201).json({ message: `Hello ${name}`, bigName });
  });

app.route("/set-password").post((req, res) => {
  const { password } = req.body;

  let message;
  if (!password) {
    message = "Provide Password";
  } else if (password.length < 8) {
    message = "Small";
  } else {
    message = "Strong";
  }
  res.status(201).json({ message });
});

app.route("/test").post(async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    return res.status(200).json({ time: result.rows[0] });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on PORT : ${PORT}`);
});

export default app;
