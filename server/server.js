import express from 'express'
import connectDB from './config/mongodb.js';
import cors from 'cors'
import dotenv from 'dotenv'
import userRoutes from './routes/userRoutes.js'
import cookieParser from 'cookie-parser';
import productRoutes from './routes/productRoutes.js'
import cartRoutes from './routes/cartRoutes.js'
import checkoutRoutes from './routes/checkoutRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import subscriberRoutes from './routes/subscriberRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import productAdminRoutes from './routes/productAdminRoutes.js'
import orderAdminRoutes from './routes/orderAdminRoutes.js'
connectDB();

const app = express();
app.use(express.json());
app.use(cookieParser())

dotenv.config();
app.use(cors({
    origin:'http://localhost:5173',
    credentials:true,
}));

app.get('/',  (req, res) => {
    res.json({message:'API Working'});
});

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/checkout', checkoutRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/subscribe', subscriberRoutes)

// admin routes
app.use('/api/admin/users', adminRoutes)
app.use('/api/admin/products', productAdminRoutes)
app.use('/api/admin/orders', orderAdminRoutes)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running at PORT: ${PORT}`));
