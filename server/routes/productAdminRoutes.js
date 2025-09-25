import express from 'express'
import userAuth, { admin } from '../middleware/userAuth.js'
import Product from '../models/ProductSchema.js'

const router = express.Router()

// get all products
router.get('/', userAuth, admin, async (req, res) => {
    try {
        const products = await Product.find({})
        res.json(products)
    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'Server Error'})
    }
})
export default router