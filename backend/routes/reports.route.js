import express from "express";
import { authorize, protect } from "../controllers/auth.controller.js";
import { getCountUnreadReports, getReportDetails, getReports, getReportsStream, resolveReport } from "../controllers/reports.controller.js";
const router = express.Router();

router.use(protect, authorize("admin"));

router.get("/", getReports);
router.get("/count", getCountUnreadReports)
router.get("/stream", getReportsStream)

router.route("/:id").get(getReportDetails).patch(resolveReport);


export default router;