import mongoose from "mongoose";

const reviewReportSchema = new mongoose.Schema({
    reviewId: { type: mongoose.Schema.Types.ObjectId, ref: 'Review', required: true },
    reporterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reason: {
        type: String,
        enum: ['spam', 'inappropriate', 'fake', 'other'],
        required: true
    },
    status: {
        type: String,
        enum: ['unread', 'viewed', 'resolved'],
        default: 'unread'
    },

    // Denormalized fields for admin display
    productTitle: { type: String, required: true },
    reviewAuthorName: { type: String, required: true },
    reviewTitle: String,
    reporterName: { type: String },

    resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    action: {
        type: String,
        enum: ['suspend_user', 'delete_review', 'dismiss'],
    },
    resolvedAt: Date
}, { timestamps: true });


reviewReportSchema.index({ status: 1, createdAt: -1 });

const ReviewReport = mongoose.model("ReviewReport", reviewReportSchema);
export default ReviewReport;