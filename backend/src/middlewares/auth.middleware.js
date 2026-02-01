import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendError } from "../utils/responseFormatter.js";
import { HTTP_STATUS } from "../constants.js";
import { User } from "../models/user.model.js";

/**
 * AUTHENTICATION MIDDLEWARE
 * Verifies the JWT from cookies and attaches the user to req.user
 */
export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        // 1. Get token from cookies (or Authorization header as a fallback)
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return sendError(res, HTTP_STATUS.UNAUTHORIZED, "Unauthorized request: No token provided");
        }

        // 2. Verify the token
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // 3. Find user in DB
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

        if (!user) {
            // If user doesn't exist anymore, clear the stale cookie
            res.clearCookie("accessToken", { httpOnly: true, secure: true });
            return sendError(res, HTTP_STATUS.UNAUTHORIZED, "Invalid Access Token: User not found");
        }

        // 4. Attach user to request object
        req.user = user;
        next();
        
    } catch (error) {
        // Clear cookie if verification fails (expired or tampered)
        res.clearCookie("accessToken", { httpOnly: true, secure: true });
        return sendError(
            res, 
            HTTP_STATUS.UNAUTHORIZED, 
            error?.message || "Invalid access token"
        );
    }
});