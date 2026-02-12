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
        type: [String],
        default: []
    }
})

reviewSchema.statics.calcProductRatingStats = async function (productId) {
    const objectId =
        typeof productId === "string"
            ? mongoose.Types.ObjectId.createFromHexString(productId)
            : productId;

    // Aggregate reviews for this product
    const stats = await this.aggregate([
        { $match: { productId: objectId } },
        {
            $group: {
                _id: { $round: ["$rating", 0] }, // round rating to nearest integer
                count: { $sum: 1 },
                avgRating: { $avg: "$rating" },
            },
        },
    ]);

    // Initialize distribution map with all stars (percentages)
    const distribution = new Map([
        ["5", 0],
        ["4", 0],
        ["3", 0],
        ["2", 0],
        ["1", 0],
    ]);

    let totalReviews = 0;
    let totalRatingSum = 0;

    // Fill distribution and calculate totals
    stats.forEach((item) => {
        const rating = String(item._id); // Map key must be string
        const count = item.count;

        if (distribution.has(rating)) {
            distribution.set(rating, count); // store raw counts for now
        }

        totalReviews += count;
        totalRatingSum += item.avgRating * count; // weighted sum
    });

    // Convert distribution counts to percentages
    for (const [rating, count] of distribution) {
        const percent = totalReviews ? Math.round((count / totalReviews) * 100) : 0;
        distribution.set(rating, percent);
    }

    // Calculate average rating rounded to 1 decimal
    const average = totalReviews ? Math.round((totalRatingSum / totalReviews) * 10) / 10 : 0;

    // Update the product
    await Product.findByIdAndUpdate(objectId, {
        ratingStats: {
            average,
            count: totalReviews,
            distribution,
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

reviewSchema.set('toJSON', {
    transform: function (doc, ret) {
        ret.helpful = ret.helpful?.length || 0;
        return ret;
    }
});

reviewSchema.set('toObject', {
    transform: function (doc, ret) {
        ret.helpful = ret.helpful?.length || 0;
        return ret;
    }
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;