import { Router } from "express"
import {
  registerController,
  loginController,
} from "../controller/admin.controller.js"
import { requireAuth } from "../middleware/auth.middleware.js"

const router = Router()

router.post("/register", registerController)

router.post("/login", loginController)

router.post("/movies", requireAuth, )

router.get("/health", (req, res) => {
  return res.status(200).json({ message: "server is up and running !" })
})

export default router
