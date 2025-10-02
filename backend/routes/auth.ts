// backend/src/routes/auth.ts
import { Router } from "express";
import { signup, login, me } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", authMiddleware, me);

export default router;



// import { Router } from "express";
// import { signup, login, getMe } from "../controllers/authController.js";
// import { authMiddleware } from "../middleware/authMiddleware.js";

// const router = Router();

// router.post("/signup", signup);
// router.post("/login", login);
// router.get("/me", authMiddleware, getMe);

// export default router;