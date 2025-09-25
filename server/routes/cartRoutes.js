import express from 'express'
import userAuth from '../middleware/userAuth.js';
import Cart from '../models/CartSchema.js'
import Product from '../models/ProductSchema.js'
const router = express.Router();
// helper function 
const getCart = async (userId, guestId) => {
    if (userId) {
        return await Cart.findOne({ user: userId })
    } else if (guestId) {
        return await Cart.findOne({ guestId })
    }
    return null
}

// add product to cart for a guest or logged in user
router.post('/', async (req, res) => {
    const { productId, quantity, size, color, guestId, userId } = req.body
    try {
        const product = await Product.findById(productId)
        if (!product) return res.status(404).json({ message: 'Product Not Found' });
        let cart = await getCart(userId, guestId)
        if (cart) {
            const productIndex = cart.orderItems.findIndex((p) => p.productId.toString() === productId && p.size === size && p.color === color)
            if (productIndex > -1) {
                cart.orderItems[productIndex].quantity += quantity
            } else {
                cart.orderItems.push({
                    productId,
                    name: product.name,
                    image: product.images[0].url,
                    price: product.price,
                    size,
                    color,
                    quantity
                })
            }
            // recalculate the total price
            cart.totalPrice = cart.orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
            await cart.save()
            return res.status(200).json(cart)
        } else {
            // create new cart for user
            const newCart = await Cart.create({
                user: userId ? userId : undefined,
                guestId: guestId ? guestId : 'guest_' + new Date().getTime(),
                orderItems: [
                    {
                        productId,
                        name: product.name,
                        image: product.images[0].url,
                        price: product.price,
                        size,
                        color,
                        quantity
                    }
                ],
                totalPrice: product.price * quantity
            })
            return res.status(201).json(newCart)
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server Error' })
    }
})

/// update quantity 
router.put('/', async (req, res) => {
    const { productId, quantity, size, color, guestId, userId } = req.body;

    try {
        let cart = await getCart(userId, guestId);
        if (!cart) return res.status(404).json({ message: 'Cart Not Found' });
        const productIndex = cart.orderItems.findIndex(
            (p) =>
                p.productId.toString() === productId.toString() &&
                p.size === size &&
                p.color === color
        );

        if (productIndex > -1) {
            if (quantity > 0) {
                cart.orderItems[productIndex].quantity = quantity;
            } else {
                cart.orderItems.splice(productIndex, 1);
            }
            cart.totalPrice = cart.orderItems.reduce(
                (acc, item) => acc + item.price * item.quantity,
                0
            );
            await cart.save();
            return res.status(200).json(cart);
        } else {
            return res.status(404).json({ message: 'Product not found in cart' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// delete product
router.delete('/', async (req, res) => {
    const { productId, size, color, guestId, userId } = req.body
    try {
        let cart = await getCart(userId, guestId)
        if (!cart) return res.status(404).json({ message: 'Cart Not Found' });
        const productIndex = cart.orderItems.findIndex(
            (p) => p.productId.toString() === productId && p.size === size && p.color === color
        )
        if (productIndex > -1) {
            cart.orderItems.splice(productIndex, 1)
            cart.totalPrice = cart.orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
            await cart.save()
            return res.status(200).json(cart)
        } else {
            return res.status(404).json({ message: 'Product not found in cart' })
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server Error' })
    }
})


// get logged in user or guest cart
router.get('/', async (req, res) => {
    const { userId, guestId } = req.query
    try {
        const cart = await getCart(userId, guestId)
        if (cart) {
            res.json(cart)
        } else {
            res.status(404).json({ message: 'Cart Not Found' })
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server Error' })
    }
})

// merge guest cart with user cart on login
router.post('/merge', userAuth, async (req, res) => {
    const { guestId } = req.body
    try {
        const guestCart = await Cart.findOne({ guestId })
        const userCart = await Cart.findOne({ user: req.user._id })

        if (guestCart) {
            if (guestCart.orderItems.length === 0) {
                res.status(400).json({ message: 'Guest cart is empty' })
            }
            if (userCart) {
                // merge guest cart into user cart
                guestCart.orderItems.forEach((guestItem) => {
                    const productIndex = userCart.orderItems.findIndex((item) => item.productId.toString() === guestItem.productId.toString() && item.size === guestItem.size && item.color === guestItem.color)

                    if (productIndex > -1) {
                        userCart.orderItems[productIndex].quantity += guestItem.quantity
                    } else {
                        userCart.orderItems.push(guestItem)
                    }
                });
                userCart.totalPrice = userCart.orderItems.reduce(
                    (acc, item) => acc + item.price * item.quantity, 0
                );
                await userCart.save()
                // remove thr guest cart after merging
                try {
                    await Cart.findOneAndDelete({ guestId })
                } catch (error) {
                    console.log('Error deleting guest cart:- ', error);
                }
                res.status(200).json(userCart)
            } else {
                // if the user has no existing cart, assign the guest cart to the user
                guestCart.user = req.user._id
                guestCart.guestId = undefined
                await guestCart.save()
                res.status(200).json(guestCart)
            }
        } else {
            if (userCart) {
                // guest cart has already been merged, return user cart
                return res.status(200).json(userCart)
            }
            res.status(404).json({ message: 'Guest cart not found' })
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server Error' })
    }
})


export default router