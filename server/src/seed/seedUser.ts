import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { stdin as input, stdout as output } from "node:process";
import { createInterface } from "node:readline/promises";
import { connectDB } from "../config/db.js";
import { User } from "../models/User.js";

// Interactive creation of an admin account, so credentials never live in .env.
// In production: `docker compose exec api node dist/seed/seedUser.js`
const run = async () => {
  // Reading through the line iterator (rather than rl.question) also works
  // when the answers are piped in, where rl.question drops early lines
  const rl = createInterface({ input, terminal: false });
  const lines = rl[Symbol.asyncIterator]();
  const ask = async (prompt: string) => {
    output.write(prompt);
    const { value } = await lines.next();
    return typeof value === "string" ? value : "";
  };
  const username = (await ask("Username: ")).trim();
  const email = (await ask("Email: ")).toLowerCase().trim();
  const password = await ask("Password (12 characters min): ");
  rl.close();

  if (!username || !email || !password) throw new Error("Username, email and password are required");
  if (password.length < 12) throw new Error("Password must be at least 12 characters");

  await connectDB();
  const existing = await User.findOne({ $or: [{ email }, { username }] });
  if (existing) {
    console.log("A user with this username or email already exists, skipping.");
  } else {
    await User.create({ username, email, passwordHash: await bcrypt.hash(password, 12) });
    console.log(`User ${username} created.`);
  }
  await mongoose.disconnect();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
