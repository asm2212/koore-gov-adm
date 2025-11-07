import { Router } from "express";
import { createDoc, getDocs, getDocById, updateDoc, deleteDoc } from "../controllers/docs.controller";
import { uploadDoc } from "../middlewares/uploadDoc.middleware";

const router = Router();

router.post("/", uploadDoc.single("file"), createDoc);
router.get("/", getDocs);
router.get("/:id", getDocById);
router.put("/:id", uploadDoc.single("file"), updateDoc);
router.delete("/:id", deleteDoc);



export default router;
