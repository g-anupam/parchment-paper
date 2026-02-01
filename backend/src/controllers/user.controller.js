import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { sendSuccess, sendError } from "../utils/responseFormatter.js";
import { HTTP_STATUS } from "../constants.js";
import jwt from "jsonwebtoken";

/**
 * @desc    Helper to generate both tokens and save Refresh Token to DB
 * @private
 */
const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    
    // We use validateBeforeSave: false because we don't have the password 
    // in the current 'user' object (due to select: false)
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new Error("Token generation failed");
  }
};

/**
 * @desc    Register a new user
 * @route   POST /api/v1/users/signup
 */
export const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;

  // 1. Check if user already exists
  const existedUser = await User.findOne({ email });
  if (existedUser) {
    return sendError(res, HTTP_STATUS.CONFLICT, "User with this email already exists");
  }

  // 2. Create user (Password hashing is handled by user.model.js pre-save hook)
  const user = await User.create({
    fullName,
    email,
    password,
  });

  // 3. Select user without sensitive fields for response
  const createdUser = await User.findById(user._id).select("-password -refreshToken");

  if (!createdUser) {
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, "User registration failed");
  }

  return sendSuccess(res, HTTP_STATUS.CREATED, "User registered successfully", createdUser);
});

/**
 * @desc    Login user & set cookies
 * @route   POST /api/v1/users/login
 */
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // 1. Find user & include password for verification
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return sendError(res, HTTP_STATUS.NOT_FOUND, "User does not exist");
  }

  // 2. Validate password via instance method
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    return sendError(res, HTTP_STATUS.UNAUTHORIZED, "Invalid user credentials");
  }

  // 3. Generate tokens & update DB
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

  // 4. Secure Cookie Options
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  return res
    .status(HTTP_STATUS.OK)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json({
      success: true,
      statusCode: HTTP_STATUS.OK,
      message: "User logged in successfully",
      data: { user: loggedInUser, accessToken, refreshToken },
    });
});

/**
 * @desc    Logout user (Clear DB & Cookies)
 * @route   POST /api/v1/users/logout
 */
export const logoutUser = asyncHandler(async (req, res) => {
  // Clear refresh token in database
  await User.findByIdAndUpdate(
    req.user._id,
    { $set: { refreshToken: undefined } },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  return res
    .status(HTTP_STATUS.OK)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json({
      success: true,
      statusCode: HTTP_STATUS.OK,
      message: "User logged out successfully",
    });
});

/**
 * @desc    Renew Access Token using Refresh Token (Rotation)
 * @route   POST /api/v1/users/refresh-token
 */
export const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    return sendError(res, HTTP_STATUS.UNAUTHORIZED, "Unauthenticated request");
  }

  try {
    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id);
    if (!user || incomingRefreshToken !== user?.refreshToken) {
      return sendError(res, HTTP_STATUS.UNAUTHORIZED, "Refresh token is expired or invalid");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    };

  return res
    .status(HTTP_STATUS.OK)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json({
      success: true,
      statusCode: HTTP_STATUS.OK,
      message: "Access token refreshed",
      data: { accessToken, refreshToken },
    });
  } catch (error) {
    return sendError(res, HTTP_STATUS.UNAUTHORIZED, error?.message || "Invalid refresh token");
  }
});