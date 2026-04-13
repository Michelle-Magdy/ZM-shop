import Review from "../models/review.model.js";
import ReviewReport from "../models/reviewReport.model.js";
import User from "../models/user.model.js";
import APIFeatures from "../util/apiFeatures.js";
import AppError from "../util/appError.js";
import catchAsync from "../util/catchAsync.js";
import reportEmitter from "../util/reportEvents.js";

export const getReportsStream = catchAsync(async (req, res, next) => {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });

    const sendReport = (report) => {
        try {
            res.write(`data: ${JSON.stringify(report)}\n\n`);
        } catch (err) {
            cleanup();
        }
    };

    reportEmitter.on("new-report", sendReport);

    const pingInterval = setInterval(() => {
        res.write(':ping\n\n');
    }, 30000);

    const cleanup = () => {
        clearInterval(pingInterval);
        reportEmitter.off("new-report", sendReport);
    };

    req.on('close', cleanup);
    req.on('error', cleanup);
});

export const getCountUnreadReports = catchAsync(async (req, res) => {
    const unreadCount = await ReviewReport.countDocuments({ status: "unread" });
    res.status(200).json({
        status: "success",
        unreadCount
    })
})

export const getReports = catchAsync(async (req, res) => {
    const features = new APIFeatures(ReviewReport, req.query)
        .filter()
        .paginate();

    const reports = await features.execute(ReviewReport);

    res.status(200).json({
        status: "success",
        reports
    });
});



export const getReportDetails = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const report = await ReviewReport.findById(id).populate("reviewId", "description date rating");

    if (!report) {
        return next(new AppError("Report was not found.", 404));
    }

    if (report.status === 'unread') {
        report.status = 'viewed';
        await report.save();
    }

    res.status(200).json({
        status: "success",
        report
    });
});

export const resolveReport = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { action } = req.body;

    if (action !== 'delete_review' && action !== 'suspend_user' && action !== 'dismiss') {
        return next(new AppError("Invalid action", 400));
    }

    const report = await ReviewReport.findByIdAndUpdate(
        id,
        {
            status: 'resolved',
            resolvedBy: req.user._id,
            resolvedAt: new Date(),
            action
        },
        { new: true }
    ).populate("reviewId", "userId");

    if (!report) {
        return next(new AppError("Report was not found.", 404));
    }

    let message;
    if (action === "delete_review") {
        await Review.findByIdAndDelete(report.reviewId._id);
        message = "Review was deleted successfully.";
    } else if (action === "suspend_user") {
        await User.findByIdAndUpdate(report.reviewId.userId, {
            isSuspended: true
        });
        await Review.findByIdAndDelete(report.reviewId._id);
        message = "User was suspended successfully.";
    } else {
        message = "Report dismissed."
    }

    res.status(200).json({
        status: "success",
        message
    });
});