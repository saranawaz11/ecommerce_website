import express from 'express'
import User from '../models/UserSchema.js'
import { userAuth, admin} from '../middleware/userAuth.js'

const router = express.Router()
router.get('/', userAuth, admin, async(req, res) => {
    try {
        const users = await User.find({}).select('-password')
        res.json(users)
    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'Server Error'})
    }
})

// add new user, admin only
router.post('/', userAuth, admin, async(req, res) => {
    const {name, email, password, role} = req.body
    try {
        let user = await User.findOne({email})
        if(user){
            return res.status(400).json({message: 'User already exists!'})
        }
        user = new User({
            name,
            email,
            password,
            role: role || 'customer'
        })
        await user.save()
        res.status(201).json(user)
    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'Server Error'})
    }
})

// update user info
router.put('/:id', userAuth, admin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if(user){
            user.name = req.body.name || user.name,
            user.email = req.body.email || user.email,
            user.role = req.body.role || user.role
        }
        const updatedUser = await user.save()
        res.json({message: 'User updated successfully!', user: updatedUser})
    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'Server Error'})
    }
})

// delete user
router.delete('/:id', userAuth, admin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if(user){
            await user.deleteOne()
            res.json({message: 'User deleted successfully!'})
        }else{
            res.status(400).json({message: 'User Not Found!'})
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'Server Error'})
    }
})
export default router