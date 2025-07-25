import { Request, Response } from "express";
import { registerUser, findUserByEmail } from "../services/authService";
import jwt from "jsonwebtoken";
import { getAllUsers } from '../services/authService';
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isStrongPassword(password: string): boolean {
  return /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
}

export async function listUsers(req: Request, res: Response) {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (err: any) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

export async function register(req: Request, res: Response) {
  try {
    const { name, surname, email, password, confirmPassword } = req.body;

    if (!name || !surname || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (name.trim().length < 2 || surname.trim().length < 2) {
      return res
        .status(400)
        .json({ message: "First and last name must be at least 2 characters." });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email address." });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    if (!isStrongPassword(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters, include one uppercase letter and one number.",
      });
    }

    const user = await registerUser({ name, surname, email, password });

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: { id: user.id, email: user.email, name: user.name },
      token,
    });
  } catch (err: any) {
    console.error("Register error:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
}

export async function googleLogin(req: Request, res: Response) {
  try {
    const { tokenId } = req.body;
    if (!tokenId) {
      return res.status(400).json({ message: "Token ID is required" });
    }

    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return res.status(400).json({ message: "Invalid Google token" });
    }

    const email = payload.email;
    const name = payload.given_name || "GoogleUser";
    const surname = payload.family_name || "";

    let user = await findUserByEmail(email);

    if (!user) {
      // Register new user with empty password (Google OAuth)
      user = await registerUser({
        name,
        surname,
        email,
        password: "", // no password since Google OAuth
      });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    return res.status(200).json({
      message: "User registered/logged in successfully",
      user: { id: user.id, email: user.email, name: user.name, surname: user.surname },
      token,
    });
  } catch (error) {
    console.error("Google login error:", error);
    return res.status(500).json({ message: "Google login failed" });
  }
}
