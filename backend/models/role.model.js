import mongoose from "mongoose";

const roleSchema = mongoose.Schema({
    name: {
        type: String,
        enum: ['user','admin','delivery','vendor'],
        required: true
    },
    permissions: [String]
});


const Role = new mongoose.model('Role', roleSchema);

export default Role;