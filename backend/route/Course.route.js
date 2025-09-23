import express from "express";
import { getCourse, getSingleCourse } from "../controler/Course.controler.js";

const router = express.Router();

router.get("/", getCourse);
router.get("/:id", getSingleCourse);

export default router;
