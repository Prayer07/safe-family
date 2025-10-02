import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { pushLocation, getFamilyLastLocations } from "../controllers/locationController.js";

const router = Router();

router.post("/", authMiddleware, pushLocation);
router.get("/family/last", authMiddleware, getFamilyLastLocations);

export default router;




// import { Router } from "express";
// import { pushLocation, lastLocation, locationHistory } from "../controllers/locationController.js";
// import { authMiddleware } from "../middleware/authMiddleware.js";

// const router = Router();

// router.post("/", authMiddleware, pushLocation);
// router.get("/:userId/last", authMiddleware, lastLocation);
// router.get("/:userId/history", authMiddleware, locationHistory);

// export default router;