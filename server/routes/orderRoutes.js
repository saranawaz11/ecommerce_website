import express from 'express'
import userAuth from '../middleware/userAuth.js'
import Order from '../models/OrderSchema.js'

const router = express.Router()
router.post('/', userAuth, async (req, res) => {
    try {
        const { orderItems, shippingAddress, paymentMethod, totalPrice } = req.body;

        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        const order = new Order({
            user: req.user._id,
            orderItems,
            shippingAddress,
            paymentMethod,
            totalPrice,
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.get('/my-orders', userAuth, async (req, res) => {
    try {
        // find orders for authenticated user
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 }).populate("orderItems.productId", "name image price").populate('user', 'name email');
        res.json(orders) // sort by recent orders
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server Error' })
    }
})

// orders details by id
router.get('/:id', userAuth, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate("user", "name email").populate("orderItems.productId", "name image price");
        if (!order) {
            return res.status(404).json({ message: 'Order Not Found' })
        }
        console.log('Orders details from backend:- ', order);
        
        // return the full order details
        res.json(order)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server Error' })
    }
})

export default router