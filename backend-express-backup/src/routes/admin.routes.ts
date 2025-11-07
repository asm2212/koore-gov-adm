import { Router } from "express";
import * as adminController from "../controllers/admin.controller";
import { authenticateJWT, authorizeRoles } from "../middlewares/auth.middleware";

const router = Router();

// All admin routes protected for SUPER_ADMIN only
router.use(authenticateJWT, authorizeRoles("SUPER_ADMIN"));

router.post("/create", adminController.createAdmin);
router.get("/", adminController.getAdmins);
router.get("/count", adminController.countAdmins); // <-- for dashboard
router.get("/:id", adminController.getAdmin);
router.put("/:id", adminController.updateAdmin);
router.delete("/:id", adminController.deleteAdmin);

// Extra actions expected by your UI:
router.patch("/:id/activate", adminController.activateAdmin);
router.patch("/:id/deactivate", adminController.deactivateAdmin);
router.post("/:id/reset-password", adminController.resetPassword);

export default router;
