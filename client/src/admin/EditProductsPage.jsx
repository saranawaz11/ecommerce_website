import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import { fetchProductDetails } from '../redux/slices/productsSlice';
import axios from 'axios';
import { updateProduct } from '../redux/slices/adminProductSlice';

function EditProductsPage() {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { id } = useParams()
    const { selectedProducts, loading, error } = useSelector((state) => state.products)
    const [productData, setProductData] = useState({
        name: '',
        description: '',
        price: 0,
        countInStock: 0,
        sku: '',
        category: '',
        brand: '',
        sizes: [],
        colors: [],
        collections: '',
        material: '',
        gender: '',
        images: []
    });

    const [uploading, setUploading] = useState(false)

    useEffect(() => {
        if (id) {
            dispatch(fetchProductDetails(id))
        }
    }, [dispatch, id])

    useEffect(() => {
        if (selectedProducts) {
            setProductData(selectedProducts)
        }
    }, [selectedProducts])

    const handleChange = (e) => {
        const { name, value } = e.target
        setProductData((prevData) => ({ ...prevData, [name]: value }))
    }

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData()
        formData.append('image', file)
        try {
            setUploading(true)
            const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setProductData((prevData) => ({
                ...prevData,
                images: [...prevData.images, data]
            }));

            setUploading(false)
        } catch (error) {
            console.error(error);
            setUploading(false)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        dispatch(updateProduct({ id, productData }))
        navigate('/admin/products')
    }

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error: {error}</p>

    return (
        <div>
            <div className='p-4 shadow-md  mx-auto my-10 max-w-4xl m-4  lg:mx-auto lg:mt-10'>
                <h1 className='w-full text-2xl font-bold'>Edit Product</h1>
                <div className='w-full my-5 '>
                    <form className='w-full' onSubmit={handleSubmit}>
                        <div className='flex flex-col mt-3'>
                            <label htmlFor="name" className='font-bold pb-1'>Product Name</label>
                            <input type="text"
                                name="name"
                                value={productData.name}
                                onChange={handleChange}
                                required className='outline-none border border-slate-400 p-1 rounded' />
                        </div>

                        {/* //description */}
                        <div className='flex flex-col mt-3'>
                            <label htmlFor="desc" className='font-bold pb-1'>Description</label>
                            <input
                                type="text"
                                name="description"
                                value={productData.description}
                                onChange={handleChange}
                                className='outline-none border border-slate-400 p-1 rounded'
                                rows={4}
                                required
                            />
                        </div>

                        {/* price */}
                        <div className='flex flex-col mt-3'>
                            <label className='font-bold pb-1'>Price</label>
                            <input
                                type="text"
                                name="price"
                                value={productData.price}
                                onChange={handleChange}
                                className='outline-none border border-slate-400 p-1 rounded'
                            />
                        </div>

                        {/* stock count */}
                        <div className='flex flex-col mt-3'>
                            <label className='font-bold pb-1'>Count in Stock</label>
                            <input
                                type="text"
                                name="countInStock"
                                value={productData.countInStock}
                                onChange={handleChange}
                                className='outline-none border border-slate-400 p-1 rounded'
                            />
                        </div>

                        {/* sku */}
                        <div className='flex flex-col mt-3'>
                            <label className='font-bold pb-1'>SKU</label>
                            <input
                                type="text"
                                name="sku"
                                value={productData.sku}
                                onChange={handleChange}
                                className='outline-none border border-slate-400 p-1 rounded'
                            />
                        </div>

                        {/* sizes */}
                        <div className='flex flex-col mt-3'>
                            <label className='font-bold pb-1'>Sizes (comma-separated)</label>
                            <input
                                type="text"
                                name="sizes"
                                value={productData.sizes.join(',')}
                                onChange={(e) => setProductData({ ...productData, sizes: e.target.value.split(',').map((size) => size.trim()) })}
                                className='outline-none border border-slate-400 p-1 rounded'
                            />
                        </div>

                        {/* colors */}
                        <div className='flex flex-col mt-3'>
                            <label className='font-bold pb-1'>Colors (comma-separated)</label>
                            <input
                                type="text"
                                name="colors"
                                value={productData.colors.join(',')}
                                onChange={(e) => setProductData({ ...productData, colors: e.target.value.split(',').map((color) => color.trim()) })}
                                className='outline-none border border-slate-400 p-1 rounded'
                            />
                        </div>

                        {/* // image upload */}
                        <div>
                            <div className='mt-3'>
                                <label htmlFor="file" className='font-bold pb-1 block'>Upload Image</label>
                                <input
                                    type="file"
                                    onChange={handleImageUpload}
                                    className='border p-1 rounded w-full' />
                            </div>
                            {uploading && <p>Uploading Image...</p>}
                            <div className='my-4 flex gap-2 rounded'>
                                {productData.images.map((image, index) => (
                                    <div key={index} className='h-20 w-20 rounded bg-gray-300'>
                                        <img src={image.url} alt='Product Image' className='rounded' />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button
                            type='submit'
                            className='p-2 mt-5 rounded px-3 text-white bg-green-600 block hover:bg-green-600/80 btn active:bg-green-700 w-full'>
                            Update Product
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default EditProductsPage