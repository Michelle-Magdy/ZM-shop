import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    label: {
        type: String,
        trim: true
    },
    address: {
        type: String,
        required
    },
    coordinates: {
        type: [Number],
        required
    },
    name: {
        type: String
    },
    isDefault: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

const Address = mongoose.model('Address', addressSchema);

export default Address;