import { Request, Response } from "express";
import { registerUser, findUserByEmail, createVerificationToken, verifyEmailToken } from "../services/authService";
import jwt from "jsonwebtoken";
import { getAllUsers } from "../services/authService";
import { OAuth2Client } from "google-auth-library";
import bcrypt from "bcryptjs";
import sendEmail from "../utils/sendEmail";

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
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function register(req: Request, res: Response) {
  try {
    const { name, surname, email, password, confirmPassword } = req.body;

    if (!name || !surname || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email address." });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    if (!isStrongPassword(password)) {
      return res.status(400).json({
        message: "Password must be at least 8 characters, include one uppercase letter and one number.",
      });
    }

    const user = await registerUser({ name, surname, email, password });

    const { token } = await createVerificationToken(user.id);

      await sendEmail(user.email, "Verify Your Email", `
      <h1>Verify your email</h1>
      <p>Enter this verification code in the app to activate your account:</p>
      <h2>${token}</h2>
      `);


    return res.status(201).json({
      message: "User registered successfully. Check your email for verification link.",
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
      user = await registerUser({
        name,
        surname,
        email,
        password: "",
        emailVerified: true, // ✅ Set verified because Google verified it
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

export async function verifyEmail(req: Request, res: Response) {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: "Token required" });

    const user = await verifyEmailToken(token);
    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    const jwtToken = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    return res.status(200).json({
      message: "Email verified successfully",
      token: jwtToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        emailVerified: user.emailVerified,
      },
    });
  } catch (err) {
    console.error("Verify email error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password are required" });

    const user = await findUserByEmail(email);
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    if (!user.emailVerified) {
      return res.status(403).json({ message: "Please verify your email before logging in." });
    }

    const isMatch = await bcrypt.compare(password, user.password || "");
    if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        emailVerified: user.emailVerified,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}
