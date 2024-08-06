import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const secretKey = "your-secret-key";

//Function to generate a random id
export const generateId = (length: number = 5): string => {
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  let randomString = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters[randomIndex];
  }

  return randomString;
};
// Function to hash a password using bcrypt
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10; // Number of salt rounds
  return await bcrypt.hash(password, saltRounds);
};

// Function to compare a password with its hash using bcrypt
export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

// Function to generate a JWT token
export const generateToken = (payload: object): string => {
  return jwt.sign(payload, secretKey, { expiresIn: "1h" }); // Token expires in 1 hour
};

// Function to verify a JWT token
export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, secretKey);
  } catch (error) {
    throw new Error("Invalid token");
  }
};

// Function to generate 6 digit OTP code
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const wrapper = (fn: Function) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      const code = (error as any).code || 500;
      const message = (error as any).message || "Something went wrong";
      res.status(code).json({ success: false, message });
    }
  };
};
