import express from 'express'
import UserModel from '../models/UserSchema.js'
import jwt from 'jsonwebtoken'

const router = express.Router();
import dotenv from 'dotenv'
import userAuth from '../middleware/userAuth.js';

dotenv.config()
// post api/users/register
// tegister a new user

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        // res.send(name, email, password);
        if (!email || !password || !name) {
            res.status(400).send({ message: 'Please fill out al the fields.' })
            return
        }
        if (password.length < 6) {
            res.status(400).send({ message: 'Password must be greater than 6 letters.' })
            return
        }
        const existingUser = await UserModel.findOne({ email })
        if (existingUser) {
            res.status(400).send({ message: 'User already exists' })
            return
        }
        // creating new user
        const user = await UserModel.create({ name, email, password })
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(201).json({
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Error in registering: ', error);
        res.status(500).send({ message: 'Server error' })
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            res.status(400).send({ message: 'Please fill out al the fields.' })
            return
        }
        const user = await UserModel.findOne({ email })
        if (!user) {
            res.status(400).send({ message: 'No existing user with this email found.' })
            return
        }

        const isMatch = await user.isValidPassword(password);
        if (!isMatch) {
            // throw new Error('Invalid password');
            res.status(400).send({ message: 'Invalid password' })
            return

        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(201).json({
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Error in logging in: ', error);
        res.status(500).send({ message: 'Server error' })
    }
});


// get /api/users/profile
router.get('/profile', userAuth, async (req, res) => {
    try {
        res.json(req.user)

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
})

router.post('/logout', async (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    });
    res.json({ success: true, message: 'Logged out successfully' });
})

export default router;