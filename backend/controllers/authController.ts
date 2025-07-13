import { Request, Response } from 'express';
import { registerUser } from '../services/authService';

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isStrongPassword(password: string) {
  return /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
}

export async function register(req: Request, res: Response) {
  try {
    const { name, surname, email, password, confirmPassword } = req.body;
    if (!name || !surname || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    if (name.length < 2 || surname.length < 2) {
      return res.status(400).json({ message: 'First and last name must be at least 2 characters.' });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Invalid email address.' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match.' });
    }

    if (!isStrongPassword(password)) {
      return res.status(400).json({ message: 'Password must be at least 8 characters, include one uppercase letter and one number.' });
    }

    const user = await registerUser({ name, surname, email, password });
    res.status(201).json({ message: 'User registered successfully', user: { id: user.id, email: user.email } });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}