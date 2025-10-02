// backend/src/routes/sos.ts
import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { triggerSos, acknowledgeSos } from "../controllers/sosController.js";

const router = Router();

router.post("/trigger", authMiddleware, triggerSos);
router.post("/:id/acknowledge", authMiddleware, acknowledgeSos);

export default router;


// import { Router } from "express";
// import { triggerSOS, acknowledgeSOS, recentSOS } from "../controllers/sosController.js";
// import { authMiddleware } from "../middleware/authMiddleware.js";

// const router = Router();

// router.post("/trigger", authMiddleware, triggerSOS);
// router.post("/:id/acknowledge", authMiddleware, acknowledgeSOS);
// router.get("/:familyId/recent", authMiddleware, recentSOS);

// export default router;