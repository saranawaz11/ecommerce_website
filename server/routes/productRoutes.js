import express from 'express'
import userAuth, { admin } from '../middleware/userAuth.js';
import ProductModel from '../models/ProductSchema.js'
const router = express.Router()

router.post('/', userAuth, admin, async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            discountPrice,
            countInStock,
            sku,
            category,
            brand,
            sizes,
            colors,
            collections,
            material,
            gender,
            images,
            isFeatured,
            isPublished,
            tags,
            dimensions,
            weight
        } = req.body;

        const product = new ProductModel({
            name,
            description,
            price,
            discountPrice,
            countInStock,
            sku,
            category,
            brand,
            sizes,
            colors,
            collections,
            material,
            gender,
            images,
            isFeatured,
            isPublished,
            tags,
            dimensions,
            weight,
            user: req.user._id // reference to admin user who created it
        });

        const createdProducts = await product.save();
        res.status(201).json(createdProducts)
    } catch (error) {
        console.error(error)
        res.status(500).send({ message: 'Server Error' })
    }
});

router.get('/', async (req, res) => {
    try {
        const {
            collections,
            size,
            color,
            gender,
            minPrice,
            maxPrice,
            sortBy,
            search,
            category,
            material,
            brand,
            limit
        } = req.query;

        let andConditions = [];

        if (collections && collections.toLowerCase() !== 'all') {
            andConditions.push({ collections });
        }
        if (category && category.toLowerCase() !== 'all') {
            andConditions.push({ category });
        }
        if (material) {
            andConditions.push({ material: { $in: material.split(',') } });
        }
        if (size) {
            andConditions.push({ sizes: { $in: size.split(',') } });
        }
        if (brand) {
            andConditions.push({ brand: { $in: brand.split(',') } });
        }
        if (color) {
            andConditions.push({ colors: { $in: color.split(',') } });
        }
        if (gender) {
            andConditions.push({ gender });
        }
        if (minPrice || maxPrice) {
            let priceFilter = {};
            if (minPrice) priceFilter.$gte = Number(minPrice);
            if (maxPrice) priceFilter.$lte = Number(maxPrice);
            andConditions.push({ price: priceFilter });
        }

        if (search) {
            andConditions.push({
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } }
                ]
            });
        }

        // final query
        let query = andConditions.length > 0 ? { $and: andConditions } : {};

        // sort
        let sort = {};
        if (sortBy) {
            switch (sortBy) {
                case "priceAsc": sort = { price: 1 }; break;
                case "priceDesc": sort = { price: -1 }; break;
                case "popularity": sort = { rating: -1 }; break;
            }
        }

        const products = await ProductModel.find(query).sort(sort).limit(Number(limit) || 0);
        res.json(products);

    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Server Error', error: error.message });
    }
});

// best-selelr - High ratings
router.get('/best-seller', async (req, res) => {
    try {
        const bestSellers = await ProductModel.findOne().sort({ rating: -1 })
        if (bestSellers) {
            res.json(bestSellers)
        } else {
            res.status(404).json({ message: 'No best sellers found' })
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server Error' })
    }
})

// new arrivals -> latest 8 products from creation date
router.get('/new-arrivals', async (req, res) => {
    try {
        const product = await ProductModel.find().sort({ created: -1 }).limit(8)
        res.json(product)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server Error' })
    }
})
// updating
router.put('/:id', userAuth, admin, async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            discountPrice,
            countInStock,
            sku,
            category,
            brand,
            sizes,
            colors,
            collections,
            material,
            gender,
            images,
            isFeatured,
            isPublished,
            tags,
            dimensions,
            weight
        } = req.body;

        //find product by id
        const product = await ProductModel.findById(req.params.id)
        if (product) {
            //update field
            product.name = name || product.name,
                product.description = description || product.description,
                product.price = price || product.price,
                product.discountPrice = discountPrice || product.discountPrice,
                product.countInStock = countInStock || product.countInStock,
                product.sku = sku || product.sku,
                product.category = category || product.category,
                product.brand = brand || product.brand,
                product.sizes = sizes || product.sizes,
                product.colors = colors || product.colors,
                product.collections = collections || product.collections,
                product.material = material || product.material,
                product.gender = gender || product.gender,
                product.images = images || product.images,
                product.isFeatured = isFeatured !== undefined ? isFeatured : product.isFeatured,
                product.isPublished = isPublished !== undefined ? isPublished : product.isPublished,
                product.tags = tags || product.tags,
                product.dimensions = dimensions || product.dimensions,
                product.weight = weight || product.weight

            const updatedProducts = await product.save()
            res.status(200).json(updatedProducts)
        } else {
            res.status(404).send({ message: 'Product not found' })
        }

    } catch (error) {
        console.error(error)
        res.status(500).send({ message: 'Server Error' })
    }
})

router.delete('/:id', userAuth, admin, async (req, res) => {
    try {
        const product = await ProductModel.findById(req.params.id)
        if (product) {
            await product.deleteOne()
            res.json({ message: 'Product removed' })
        } else {
            res.status(404).json({ message: 'Product not found' })
        }
    } catch (error) {
        console.error(error)
        res.status(500).send({ message: 'Server Error' })
    }
})

// getting single project by id
router.get('/:id', async (req, res) => {
    try {
        const product = await ProductModel.findById(req.params.id)
        if (product) {
            res.json(product)
        } else {
            res.status(404).json({ message: 'Product Not Found' })
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server Error' })
    }
})

// retrieving similar products based on current product gender and category
router.get('/similar/:id', async (req, res) => {
    const { id } = req.params
    try {
        const product = await ProductModel.findById(id)
        if (!product) {
            res.status(400).json({ message: 'Product Not Found' })
        }
        const similarProducts = await ProductModel.find({
            _id: { $ne: id }, // exclusind current product 
            gender: product.gender,
            category: product.category
        }).limit(4);
        res.json(similarProducts)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server Error' })
    }
})


export default router