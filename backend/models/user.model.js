import mongoose from "mongoose";
import validator from "validator";
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "User must have a name"],
        minLength: 4,
        trim: true,
        validate: {
            validator: function(el){
                return el.trim().includes(' ')
            },
            message: "Username can't have spaces inbetween"
        }
    },
    email: {
        type: String,
        validate: [validator.isEmail, "Please enter a valid email"],
        unique: [true, "Enter a unique email"],
        required: [true, "User must have an email"]
    },
    password: {
        type: String,
        validate: [validator.isStrongPassword, "Please enter a strong password"],
        required: [true, "User must have a password"],
        select: false
    },
    roles: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Role',
        select: false
    }],
    addresses: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Address'
    }],
    isDeleted: {
        type: Boolean,
        default: false,
        select: false
    },
    passwordChangedAt: Date
}, {
    timestamps: true
});

userSchema.pre('save', async function(next){
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);

        if(!this.isNew){
            this.passwordChangedAt = Date.now() - 1000;
        }
    }
    next();
});

userSchema.methods.correctPassword = async function(enteredPassword, realPassword){
    return await bcrypt.compare(enteredPassword, realPassword);
}

userSchema.methods.passwordChangedAfter = function(JWTTimeStamp){
    if(this.passwordChangedAt){
        const changedAtTimeStamp = parseInt(this.passwordChangedAt / 1000, 10);
        return JWTTimeStamp < changedAtTimeStamp;
    }
    return false;
}

userSchema.pre(/^find/, function(next){
    this.find({isDeleted: false});
    next();
})


const User = mongoose.model('User', userSchema);

export default User;