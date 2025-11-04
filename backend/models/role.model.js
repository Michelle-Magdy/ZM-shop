import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        enum: ['user','admin','delivery','vendor'],
        required: true
    },
    permissions: [String]
});


const Role = mongoose.model('Role', roleSchema);

export default Role;