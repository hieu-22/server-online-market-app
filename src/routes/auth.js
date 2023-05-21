import express from "express"
import { handleRegister, handleLogin } from "../controllers/auth"

const router = express.Router()

// routes
router.post("/register", handleRegister)
router.post("/login", handleLogin)

export default router
