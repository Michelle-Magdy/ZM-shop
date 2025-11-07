import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: [true, "Code already exist"]
    },
    discountPercentage: {
        type: Number,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    expirationDate: Date
});

const updateActivationStatus = (docs) => {
    const expiredCoupons = docs.filter(
        (coupon) => coupon.expirationDate && coupon.expirationDate < Date.now() && coupon.isActive
    );

    if (expiredCoupons.length > 0) {
        expiredCoupons.forEach((coupon) => {
            coupon.isActive = false;

            coupon.constructor
                .findByIdAndUpdate(coupon._id, { isActive: false })
                .catch(() => { });
        });
    }
}

couponSchema.post('find', function (docs) {
    if(docs && docs.length > 0)
        updateActivationStatus(docs);
});

couponSchema.post('findOne', function (doc) {
    if(doc)
        updateActivationStatus([doc]);
});


const Coupon = mongoose.model('Coupon', couponSchema);
export default Coupon;
