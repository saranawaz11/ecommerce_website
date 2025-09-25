import express from 'express'
import userAuth, { admin } from '../middleware/userAuth.js'
import Order from '../models/OrderSchema.js'

const router = express.Router()

// get all orders
router.get('/', userAuth, admin, async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'name email')
        res.json(orders)
    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'Server Error'})
    }
})

// update order status
router.put('/:id', userAuth, admin, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name')
        if(order){
            order.status = req.body.status || order.status;
            order.isDelivered = req.body.status === 'Delivered' ? true : order.isDelivered;
            order.deliveredAt = req.body.status === 'Delivered' ? Date.now() : order.deliveredAt;

            const updatedUser = await order.save()
            res.json(updatedUser)
        }else{
            res.status(400).json({message: 'Order not found'})
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'Server Error'})
    }
})

router.delete('/:id', userAuth, admin, async(req, res) => {
    try {
        const order = await Order.findById(req.params.id)
        if(order){
            await order.deleteOne()
            res.json({message: 'Order deleted successfully'})
        }else{
            res.status({message: 'Order not found'})
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'Server Error'})
    }
})
export default router