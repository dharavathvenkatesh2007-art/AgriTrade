import { Farmer, User } from "../models/index.js";
import { roles } from "../utils/constants.js";
import { ApiError, asyncHandler, sendSuccess } from "../utils/errors.js";
import { signToken } from "../middleware/auth.js";

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role = roles.FARMER, phone, village, district } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(422, "Name, email, and password are required", "VALIDATION_ERROR");
  }

  // Registration strictly allowed ONLY for Farmer or Buyer
  const allowedPublicRoles = [roles.FARMER, roles.BUYER];
  if (!allowedPublicRoles.includes(role)) {
    throw new ApiError(403, "Public registration is only available for Farmers and Buyers. Staff roles must log in directly.", "REGISTRATION_ROLE_RESTRICTED");
  }

  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) {
    throw new ApiError(409, "Email is already registered", "EMAIL_EXISTS");
  }

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    phone,
    role
  });

  if (role === roles.FARMER) {
    await Farmer.create({
      user: user._id,
      farmerCode: `FMR-${Math.floor(1000 + Math.random() * 9000)}`,
      village: village || "Lasalgaon",
      district: district || "Nashik"
    });
  }

  sendSuccess(res, { user: sanitizeUser(user), token: signToken(user) }, "Registration successful", 201);
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, "Invalid email or password", "INVALID_CREDENTIALS");
  }
  sendSuccess(res, { user: sanitizeUser(user), token: signToken(user) }, "Login successful");
});

export const me = asyncHandler(async (req, res) => {
  sendSuccess(res, sanitizeUser(req.user), "Current user");
});

function sanitizeUser(user) {
  const raw = user.toObject ? user.toObject() : user;
  delete raw.password;
  return raw;
}
