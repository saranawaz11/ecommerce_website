import express from 'express'
import Subscriber from '../models/SubscriberSchema.js'

const router = express.Router()

router.post('/', async(req, res) => {
    const {email} = req.body
    if(!email) {
        return res.status(400).json({message: 'Email is required'})
    }
    try {
        let subscriber = await Subscriber.findOne({email})
        if(subscriber){
            return res.status(400).json({message: 'Email already exists as subscribed!'})
        }

        subscriber = new Subscriber({email})
        await subscriber.save()

        res.status(201).json({message: 'Successfully subscribed to the newsletter!'})
    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'Server Error'})
    }
})

export default router