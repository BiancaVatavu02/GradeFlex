// server.js
require("dotenv").config();
const express = require("express");
const path = require("path");
const pool = require("./db");   // importam conexiunea la baza de date

const app = express();
const PORT = process.env.PORT || 3000;

// middleware pentru body (JSON + form)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// servim fisierele statice din folderul "public"
app.use(express.static(path.join(__dirname, "public")));

// cand intram pe /, redirectionam catre pagina de login
app.get("/", (req, res) => {
  res.redirect("/HTML/login.html");
});

// -------------------------
// API LOGIN
// -------------------------
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;   // email + parola din body
    console.log("Cerere login:", req.body);

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email si parola sunt obligatorii." });
    }

    // cautam in tabela users dupa email
    const result = await pool.query(
      "SELECT id, name, role, password FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res
        .status(401)
        .json({ success: false, message: "Email sau parola gresita." });
    }

    const user = result.rows[0];

    // ATENTIE: aici comparam parola in clar (pentru proiect).
    // In productie s-ar folosi hash.
    if (user.password !== password) {
      return res
        .status(401)
        .json({ success: false, message: "Email sau parola gresita." });
    }

    // succes -> intoarcem JSON
    return res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        role: user.role
      }
    });
  } catch (err) {
    console.error("Error during login:", err);
    return res
      .status(500)
      .json({ success: false, message: "Eroare de server." });
  }
});

// pornim serverul
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});