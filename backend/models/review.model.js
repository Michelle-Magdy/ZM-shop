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
        type: Number,
        default: 0
    }
})

reviewSchema.statics.calcProductRatingAvg = async function (productId) {
    try {
        const objectId = typeof productId === 'string'
        ? mongoose.Types.ObjectId.createFromHexString(productId)
        : productId;

        const stats = await this.aggregate([
            {
                $match: { productId: objectId }
            },
            {
                $group: {
                    _id: '$productId',
                    avgRating: { $avg: '$rating' },
                    nRating: { $sum: 1 }
                }
            }
        ]);

        if (stats.length === 0)
            await Product.findByIdAndUpdate(productId, { avgRating: 0, nReviews: 0 });
        else
            await Product.findByIdAndUpdate(productId, {
                avgRating: parseFloat(stats[0].avgRating.toFixed(1)),
                nReviews: stats[0].nRating
            });
    }
    catch (err) {
        console.log(err);
    }

}

reviewSchema.post('save', function () {
    this.constructor.calcProductRatingAvg(this.productId);
})

reviewSchema.post(/^findOneAnd/, function (doc) {
    if(doc)
        doc.constructor.calcProductRatingAvg(doc.productId);
})

reviewSchema.pre(/^find/, function(next) {
    this.populate('userId', 'name');
    next();
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;