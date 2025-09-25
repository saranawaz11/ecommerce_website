import mongoose from "mongoose";
import bcrypt from 'bcryptjs'
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ['customer', 'admin'],
            default: 'customer'
        }
    },
    { timestamps: true }
);

// Pre save hook for hashing password
userSchema.pre('save', async function (next) {
    try {
        // Check if the password has been modified
        if (!this.isModified('password')) return next();

        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);

        next(); 
    } catch (error) {
        next(error);
    }
});

// Match entered paswords with hashed passwords
userSchema.methods.isValidPassword = async function (password) {
    try {
        // Compare provided password with stored hash
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        throw new Error('Password comparison failed');
    }
};

const User = mongoose.model('User', userSchema);
export default User;