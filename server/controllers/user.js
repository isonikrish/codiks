import { generateTokenandSetCookie } from "../lib/generateToken.js";
import prisma from "../lib/prisma.js";
import bcrypt from "bcryptjs";

export async function handleUserSignup(req, res) {
  const data = req.body;
  const { name, email, password } = data;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ msg: "Invalid Data" });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    generateTokenandSetCookie(newUser?.id, res);

    return res.status(200).json(newUser);
  } catch (error) {
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}

export async function handleUserLogin(req, res) {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ msg: "Invalid Data" });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({ msg: "User does not exist" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    generateTokenandSetCookie(user.id, res);

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}
export async function handleGetUser(req, res) {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ msg: 'Unauthorized' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ msg: 'Internal Server Error' });
  }
}