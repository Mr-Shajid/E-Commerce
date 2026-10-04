const jwt = require ("jsonwebtoken"); 
const { z } = require ("zod");
const User = require ("../models/User");
const asyncHandler = require ("../utils/asyncHandler");
const { successResponse } = require ("../utils/apiResponse");
const { extendZodWithOpenApi } = require("@asteasolutions/zod-to-openapi");


const tokenService = require("../services/token.service");
const sessionService = require("../services/session.service");

extendZodWithOpenApi(z);

const registerSchema = z.object({
    name: z.string().min(2).openapi({ example: "shajid chy"}),
    email: z.email().openapi({ example: "shajid@example.com"}),
    password: z.string().min(6).openapi({ example: "secret123", description: "Minimum 6 characters. Hashed with bcrypt before storage."}),
}).openapi("RegisterRequest", { description: "Payload for creating a new customer account"});

const loginSchema = z.object({
    email: z.email().openapi({ example: "shajid@example.com"}),
    password: z.string().min(6).openapi({ example: "secret123"}),
}).openapi("LoginRequest", { description: "Email + password credentials."});

const loginDataShape = z.object({
    accessToken: z.string(),
});



//cookie helpers
const cookieOptions = () => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 1000,
});

const setRefreshCookie = (res,token) => res.cookie("rt", token, cookieOptions);
const clearRefreshCookie = (res) => res.clearCookie("rt", cookieOptions);

const register = asyncHandler(async (req,res) => {
     const body = registerSchema.parse(req.body);

     const existingUser = await User.findOne({email: body.email});
     if (existingUser) {
        const error = new Error("Email already exist!");
        error.statusCode = 409;
        throw error;
     }

     const user = await User.create(body);

     successResponse(res,201,"User registered successfully", {user});
});

const login = asyncHandler (async (req, res) => {
    const body = loginSchema.parse(req.body);
    const user = await User.findOne({email: body.email});

    if(!user) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }

    const ok = await user.comparePassowrd(body.password);
    if(!ok) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }

    const sid = tokenService.newSessionId();
    const accessToken = tokenService.signAcessToken(user);
    const refresToken = tokenService.signRefreshToken(user, sid);

    await sessionService.saveSession({
        userId: user._id,
        refreshToken ,
        userAgent: req.headers["user-agent"] || "unknown"
    });

    setRefreshCookie(res, refreshToken);
    return successResponse(res,200,"Login Successful", {accessToken} ) 
});

const me = asyncHandler(async (req,res) => {
    return successResponse(res,200, "Current User", {user: req.user});
});

const refresh = asyncHandler(async (req,res) => {
    return successResponse(res,200, "Use POST /api/auth/refresh", null );
}); 

const logout = asyncHandler (async (req,res) => {
    const token = req.cookies?.rt;
    if(token) {
        try {
            const decoded = jwt.decode(token);
            if(decoded?.sid) await sessionService.deleteSession(decoded.sid);
        } catch {  }
    }
    clearRefreshCookie(res);
    successResponse(res,200, "Logged out", null);
});

module.exports = { 
    register,
    registerSchema,
    login,
    loginSchema,
    me,
    refresh,
    logout,
};