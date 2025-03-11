import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Hash Password
export const hashPassword = async (password) => {
  try {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  } catch (error) {
    console.error(error);
  }
};

// Compare Password
export const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

// Generate JWT Token
export const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" } // Token expires in 1 day
  );
};

// Verify JWT Token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.error("Invalid or expired token:", error);
    return null;
  }
};
