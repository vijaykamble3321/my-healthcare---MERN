import jwt from "jsonwebtoken";
import crypto from "crypto";
import { errorResponse } from "./serverResponse.js";

// Generate and reuse the same key in production
const key = crypto.randomBytes(32).toString("hex");

// =======================
// JWT Token Utilities
// =======================
export function generatToken(payload) {
  const accessToken = jwt.sign(payload, key, { expiresIn: "15m" });
  const refreshToken = jwt.sign(payload, key, { expiresIn: "16m" });
  return { accessToken, refreshToken };
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, key);
  } catch (error) {
    console.log("JWT verification error:", error.message);
    return null;
  }
}

// =======================
// Authentication Middleware
// =======================
export async function authmiddleware(req, res, next) {
  try {
    const bearerToken = req.headers.authorization || req.headers.Authorization;

    if (!bearerToken) {
      return errorResponse(res, 401, "Authorization header missing");
    }

    const tokenData = bearerToken.split(" ");
    if (!tokenData || tokenData.length !== 2 || tokenData[0] !== "Bearer") {
      return errorResponse(res, 402, "Invalid token format");
    }

    const payload = verifyToken(tokenData[1]);
    if (!payload) {
      return errorResponse(res, 401, "Invalid or expired token");
    }

    // Set req.user so controller can access it
    req.user = {
      userid: payload.userid,
      email: payload.email,
      role: payload.role,
    };

    // Optional: set to res.locals too if needed
    res.locals.userid = payload.userid;
    res.locals.email = payload.email;
    res.locals.role = payload.role;

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return errorResponse(res, 500, "Internal server error");
  }
}

// =======================
// Role Middlewares (Optional)
// =======================
export async function isSuperAdminMiddleware(req, res, next) {
  try {
    if (!req.user || req.user.role !== "admin") {
      return errorResponse(res, 401, "Not authorized (admin only)");
    }
    next();
  } catch (error) {
    console.log("isSuperAdminMiddleware error:", error);
    errorResponse(res, 500, "Internal server error");
  }
}

export async function isDoctorMiddleware(req, res, next) {
  try {
    if (!req.user || req.user.role !== "doctor") {
      return errorResponse(res, 401, "Not authorized (doctor only)");
    }
    next();
  } catch (error) {
    console.log("isDoctorMiddleware error:", error);
    errorResponse(res, 500, "Internal server error");
  }
}
