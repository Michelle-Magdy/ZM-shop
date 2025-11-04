import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: [true, "User must have a name"],
        minLength: 4,
        trim: true,
        validate: {
            validator: function(el){
                return el.trim().contains(' ')
            },
            message: "User name can't have spaces inbetween"
        }
    },
    email: {
        type: String,
        validator: [validator.isEmail, "Please enter a valid email"],
        unique: [true, "Enter a unique email"],
        required: [true, "User must have an email"]
    },
    password: {
        type: String,
        validator: [validator.isStrongPassword, "Please enter a strong password"],
        required: [true, "User must have a password"]
    },
    role: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Role'
    }],
    addresses: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Address'
    }],
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

userSchema.pre(/^find/, function(next){
    this.find({isDeleted: false});
    next();
})


const User = mongoose.model('User', userSchema);

export default User;