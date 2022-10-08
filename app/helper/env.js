import dotenv from "dotenv";

dotenv.config();

export default (name) => {
    const value = process.env[name];
  
    if (value) return value;
    return `Missing: process.env['${name}'].`;
};