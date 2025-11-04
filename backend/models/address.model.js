import mongoose from "mongoose";

const addressSchema = mongoose.Schema({
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
})

const Address = new mongoose.model('Address', addressSchema);

export default Address;