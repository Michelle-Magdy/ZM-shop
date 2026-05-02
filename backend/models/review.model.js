import mongoose from "mongoose";
import Product from "./product.model.js";

const reviewSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product'
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    date: {
        type: Date,
        default: Date.now
    },
    rating: {
        type: Number,
        required: [true, "Review must have a rating"],
        min: 1,
        max: 5
    },
    title: String,
    description: String,
    helpful: {
        type: [mongoose.Schema.ObjectId],
        ref: 'User',
        default: []
    }
})

reviewSchema.statics.calcProductRatingStats = async function (productId) {
    const objectId =
        typeof productId === "string"
            ? mongoose.Types.ObjectId.createFromHexString(productId)
            : productId;

    const stats = await this.aggregate([
        { $match: { productId: objectId } },
        {
            $group: {
                _id: { $round: ["$rating", 0] },
                count: { $sum: 1 },
            },
        },
    ]);

    let totalReviews = 0;
    let totalRatingSum = 0;

    stats.forEach((item) => {
        totalReviews += item.count;
        totalRatingSum += item._id * item.count;
    });

    const distribution = {
        "5": 0,
        "4": 0,
        "3": 0,
        "2": 0,
        "1": 0,
    };

    stats.forEach((item) => {
        const rating = String(item._id);
        if (rating in distribution) {
            distribution[rating] = totalReviews
                ? Math.round((item.count / totalReviews) * 100)
                : 0;
        }
    });

    const average = totalReviews
        ? Math.round((totalRatingSum / totalReviews) * 10) / 10
        : 0;

    await Product.findByIdAndUpdate(objectId, {
        $set: {
            "ratingStats.average": average,
            "ratingStats.count": totalReviews,
            "ratingStats.distribution": distribution,
        },
    });
};

reviewSchema.post('save', function () {
    this.constructor.calcProductRatingStats(this.productId);
})

reviewSchema.post(/^findOneAnd/, function (doc) {
    if (doc)
        doc.constructor.calcProductRatingStats(doc.productId);
})

reviewSchema.pre(/^find/, function (next) {
    this.populate('userId', 'name');

    next();
});


const Review = mongoose.model('Review', reviewSchema);

export default Review;