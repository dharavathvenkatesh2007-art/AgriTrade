import jwt from "jsonwebtoken";
import { User } from "../models/index.js";
import { roles } from "../utils/constants.js";
import { ApiError, asyncHandler } from "../utils/errors.js";

export function signToken(user) {
  return jwt.sign(
    { id: user._id.toString(), role: user.role, organization: user.organization, region: user.region },
    process.env.JWT_SECRET || "dev-secret",
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

export const authenticate = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) throw new ApiError(401, "Authentication required", "AUTH_REQUIRED");
  const payload = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
  const user = await User.findById(payload.id);
  if (!user || !user.isActive) throw new ApiError(401, "Invalid or inactive user", "AUTH_INVALID");
  req.user = user;
  next();
});

export const authorize = (...allowedRoles) => (req, _res, next) => {
  if (!allowedRoles.includes(req.user.role)) {
    throw new ApiError(403, "You are not allowed to perform this action", "FORBIDDEN");
  }
  next();
};

export function scopedQuery(req) {
  if (!req.user || req.user.role === roles.ADMIN) return {};
  const scope = {};
  if (req.user.organization) scope.organization = req.user.organization;
  if (req.user.region) scope.region = req.user.region;
  return scope;
}
