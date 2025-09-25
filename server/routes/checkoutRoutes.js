import express from 'express'
import Product from '../models/ProductSchema.js'
import Checkout from '../models/CheckoutSchema.js'
import userAuth from '../middleware/userAuth.js'
import Order from '../models/OrderSchema.js'
import Cart from '../models/CartSchema.js'
const router = express.Router()

// create a new checkout
router.post('/', userAuth, async (req, res) => {
    const { orderItems, shippingAddress, paymentMethod, totalPrice } = req.body;

    if (!orderItems || orderItems.length === 0) {
        return res.status(400).json({ message: 'No items in cart' })
    }

    try {
        const newCheckout = await Checkout.create({
            user: req.user._id,
            orderItems: orderItems,
            shippingAddress,
            paymentMethod,
            totalPrice,
            paymentStatus: paymentMethod === 'COD' ? 'Unpaid' : 'Paid',
            isPaid: paymentMethod === 'COD' ? false : true

        })

        res.status(201).json(newCheckout)

    } catch (error) {
        console.error('Error in checking out:- ', error)
        res.status(500).json({ message: 'Server Error' })
    }
});

// /:id/pay
router.put('/:id/pay', userAuth, async (req, res) => {
    const { paymentStatus, paymentDetails } = req.body
    try {
        const checkout = await Checkout.findById(req.params.id)
        if (!checkout) {
            return res.status(404).json({ message: 'Checkout Not Found' })
        }

        if (paymentStatus === 'Paid') {
            checkout.isPaid = true;
            checkout.paymentStatus = 'Paid';
            checkout.paymentDetails = paymentDetails;
            checkout.paidAt = Date.now();
            await checkout.save();
            res.status(200).json(checkout)
        } else if (paymentStatus === 'Unpaid') {
            checkout.isPaid = false;
            checkout.paymentStatus = 'Unpaid';
            checkout.paymentDetails = paymentDetails;
            await checkout.save();
            res.status(200).json(checkout);
        } else {
            res.status(400).json({ message: 'Invalid Payment Status' })
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server Error' })
    }
})

// /:id/finalize
router.post('/:id/finalize', userAuth, async (req, res) => {
    try {
        const checkout = await Checkout.findById(req.params.id)
        if (!checkout) {
            return res.status(404).json({ message: 'Checkout Not Found' })
        }

        if (!checkout.isFinalized) {
            // create final order on base of heckout details
            const finalOrder = await Order.create({
                user: checkout.user,
                orderItems: checkout.orderItems,
                shippingAddress: checkout.shippingAddress,
                paymentMethod: checkout.paymentMethod,
                totalPrice: checkout.totalPrice,
                isPaid: checkout.paymentMethod === 'COD' ? false : true,
                paidAt: checkout.isPaid ? checkout.paidAt : null,
                isDelivered: false,
                paymentStatus: checkout.paymentStatus,
                paymentDetails: checkout.paymentDetails
            })

            //Mark the checkout at finalized
            checkout.isFinalized = true;
            checkout.finalizedAt = Date.now();
            await checkout.save()

            // delete the cart assciated with user
            await Cart.findOneAndDelete({ user: checkout.user });
            res.status(201).json(finalOrder)
        } else if (checkout.isFinalized) {
            res.status(400).json({ message: 'Checkout already finalized' })
        } else {
            res.status(400).json({ message: 'Checkout is not paid' })
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server Error' })
    }
})

export default router