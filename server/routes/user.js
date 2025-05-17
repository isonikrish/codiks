import express from 'express';
import { handleGetUser, handleUserLogin, handleUserSignup } from '../controllers/user.js';
import { protectRoute } from '../lib/generateToken.js';
const router = express.Router();

router.post("/signup", handleUserSignup);
router.post("/login", handleUserLogin);
router.get("/get-user", protectRoute, handleGetUser);
export default router;