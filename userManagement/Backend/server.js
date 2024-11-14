const express = require("express");

const bcrypt = require("bcrypt");

const { v4: uuidv4 } = require("uuid");

const bodyParser = require("body-parser");

const app = express();

const port = 8080;

const users = {};

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

function validateUserInput(username, email, password) {
  if (!username || !email || !password) {
    return "All fields are required";
  }
  if (password.length < 6) {
    return "Password should be at least 6 character long";
  }
  return null;
}

app.post("/users", async (req, res) => {
  const { username, email, password } = req.body;

  const validationError = validateUserInput(username, email, password);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  if (Object.values(users).some((user) => user.username === username)) {
    return res.status(400).json({ error: "Username already exists." });
  }
  if (Object.values(users).some((user) => user.email === email)) {
    return res.status(400).json({ error: "Email already exists." });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const userId = uuidv4();
  const user = {
    id: userId,
    username,
    email,
    password: hashedPassword,
  };
  users[userId] = user;

  res.status(201).json({ message: "User created successfully", userId });
});

app.get("/users/:id", (req, res) => {
  const { id } = req.params;
  const user = users[id];

  if (!user) {
    return res.status(404).json({ error: "user not found" });
  }

  const { password, ...userDetails } = user;
  res.json(userDetails);
});

app.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { username, email, password } = req.body;

  const validationError = validateUserInput(username, email, password);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const user = users[id];
  if (!user) {
    return res.status(404).json({ error: "user not found" });
  }
  if (
    Object.values(users).some(
      (user) => user.username === username && user.id !== id
    )
  ) {
    return res.status(400).json({ error: "Username already exists." });
  }
  if (
    Object.values(users).some((user) => user.email === email && user.id !== id)
  ) {
    return res.status(400).json({ error: "Email already exists." });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  user.username = username;
  user.email = email;
  user.password = hashedPassword;

  res.json({ message: "user updated successfully" });
});

app.delete("/users/:id", (req, res) => {
  const { id } = req.params;

  if (!users[id]) {
    return res.status(404).json({ error: "user not found" });
  }

  delete users[id];
  res.json({ message: "user deleted successfully" });
});

app.listen(port, () => {
  console.log(`User management system is running on http://localhost:${port}`);
});
