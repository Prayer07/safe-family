// backend/src/routes/family.ts
import { Router } from "express";
import { createFamily, joinFamily, getMyFamily } from "../controllers/familyController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/", authMiddleware, createFamily);
router.post("/join", authMiddleware, joinFamily);
router.get("/me", authMiddleware, getMyFamily);

export default router;


// import { Router } from "express";
// import { createFamily, createInvite, getMyFamily, joinFamily, listMembers } from "../controllers/familyController.js";
// import { authMiddleware } from "../middleware/authMiddleware.js";

// const router = Router();

// router.post("/", authMiddleware, createFamily);
// router.post("/:id/invite", authMiddleware, createInvite);
// router.post("/:id/join", authMiddleware, joinFamily); // or use /join with code in body
// router.get("/:id/members", authMiddleware, listMembers);
// router.get("/me", authMiddleware, getMyFamily); // ✅ dashboard entry


// export default router;