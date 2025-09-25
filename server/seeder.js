import mongoose from "mongoose";
import dotenv from 'dotenv'
import Product from "./models/ProductSchema.js";
import User from "./models/UserSchema.js";
import products from "./data/products.js";
import Cart from "./models/CartSchema.js";

dotenv.config()

mongoose.connect(process.env.MONGO_URI)

//function to seed data
const seedData = async (req, res) => {
    try {
        // deleting existing data
        await Product.deleteMany()
        await User.deleteMany()
        await Cart.deleteMany()

        // create a default admin user
        const createdUser = await User.create({
            name: 'Sara Nawaz',
            email: 'iamadmin@gmail.com',
            password: 'admin_12345',
            role: 'admin'
        })

        // assign the default user id to each product
        const userID = createdUser._id
        const sampleProducts = products.map((product) => {
            return { ...product, user: userID }
        })

        // insert the products in the database
        await Product.insertMany(sampleProducts)
        process.exit()

    } catch (error) {
        console.error('Error seeding the data: ', error);
        process.exit(1)
    }
}

seedData()