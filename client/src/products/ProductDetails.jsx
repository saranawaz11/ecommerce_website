import React, { useEffect, useState } from 'react'
import { FaPlus } from 'react-icons/fa';
import { FaMinus } from 'react-icons/fa6';
import ProductGrid from './ProductGrid';
import { toast } from 'sonner';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductDetails, fetchSimilarProducts } from '../redux/slices/productsSlice';
import { addToCart } from '../redux/slices/cartSlice';

function ProductDetails({ productId }) {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { selectedProducts, similarProducts, loading, error } = useSelector((state) => state.products);
    const { user, guestId } = useSelector((state) => state.auth)

    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [heroImage, setHeroImage] = useState(
        selectedProducts?.images?.[0]?.url || null
    );
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [quantity, setQuantity] = useState(1);
    const handleQuantity = (action) => {
        if (action === 'minus' & quantity > 1) {
            setQuantity(quantity - 1)
        }
        if (action === 'plus') {
            setQuantity(quantity + 1)
        }
    }

    const fetchProductId = productId || id;
    useEffect(() => {
        if (fetchProductId) {
            dispatch(fetchProductDetails(fetchProductId));
            dispatch(fetchSimilarProducts({ id: fetchProductId }))
        }
    }, [dispatch, fetchProductId])
    useEffect(() => {
        if (selectedProducts?.images?.length > 0) {
            const firstImg = typeof selectedProducts.images[0] === "string"
                ? selectedProducts.images[0]
                : selectedProducts.images[0].url;
            setHeroImage(firstImg);
        }
    }, [selectedProducts]);


    const handleAddToCart = () => {
        if (!selectedColor || !selectedSize) {
            toast.error('Please select a size and color before adding to cart', {
                duration: 2000,
            });
            return;
        }
        setIsButtonDisabled(true);
        dispatch(
            addToCart({
                productId: fetchProductId,
                quantity,
                size: selectedSize,
                color: selectedColor,
                guestId,
                userId: user?._id
            })
        )
            .then(() => {
                toast.success('Product added to cart', {
                    duration: 3000,
                })
            })
            .finally(() => {
                setIsButtonDisabled(false)
            })
    }

    if (loading) {
        return <p className='text-center'>Loading....</p>
    }
    if (error) {
        return <p className='text-center'>Error:- {error}</p>
    }
    return (
        <div className='py-3'>
            {selectedProducts && (
                <div>
                    <div className="w-full md:w-[90%] px-2 md:px-6 mx-auto my-5 flex flex-col md:flex-row gap-6">

                        {/* Left: Pics (50%) */}
                        <div className="w-full md:w-1/2 flex flex-col lg:flex-row gap-5 transition-all duration-300">
                            {/* Main image */}
                            <div className='h-[500px] rounded'>
                                <img
                                    src={heroImage}
                                    alt="Main product image"
                                    className="object-cover h-full rounded-lg"
                                />
                            </div>

                            {/* Thumbnails */}
                            <div className="flex w-[30%] flex-row lg:flex-col gap-2">
                                {selectedProducts?.images?.map((img, index) => {
                                    const imageUrl = typeof img === "string" ? img : img.url;
                                    return (
                                        <img
                                            key={index}
                                            src={imageUrl}
                                            alt={img.altText || `Thumbnail ${index}`}
                                            className={`w-[100px] rounded-lg cursor-pointer ${heroImage === imageUrl
                                                ? "border-2 border-black"
                                                : "border-2 border-transparent"
                                                }`}
                                            onClick={() => setHeroImage(imageUrl)}
                                        />
                                    );
                                })}
                            </div>
                        </div>

                        {/* Right: Writing (50%) */}
                        <div className="w-full md:w-1/2 flex flex-col text-start gap-2 px-1 md:px-6 bg-white">
                            <h2 className="text-2xl font-bold">{selectedProducts.name}</h2>
                            <p className="text-gray-700">$ {selectedProducts.price}</p>
                            <p className="text-sm">{selectedProducts.description}</p>

                            {/* Color options */}
                            <div>
                                <p className="pb-3 text-sm font-semibold">Color:</p>
                                <div className="flex gap-2">
                                    {selectedProducts.colors.map((color) => (
                                        <button
                                            key={color}
                                            onClick={() => setSelectedColor(color)}
                                            className={`btn w-8 h-8 rounded-full ${selectedColor === color
                                                ? "border-black border-2"
                                                : "border-gray-400 border"
                                                }`}
                                            style={{
                                                backgroundColor: color.toLowerCase(),
                                                filter: "brightness(0.8)",
                                            }}
                                        ></button>
                                    ))}
                                </div>
                            </div>

                            {/* Size options */}
                            <div>
                                <p className="font-semibold text-sm pb-3">Size:</p>
                                <div className="flex gap-2 font-semibold">
                                    {selectedProducts.sizes.map((size) => (
                                        <button
                                            key={size}
                                            className={`btn w-8 h-8 border border-slate-400 transform duration-100 rounded ${selectedSize === size
                                                ? "bg-black text-white"
                                                : "bg-transparent text-black hover:bg-gray-100"
                                                }`}
                                            onClick={() => setSelectedSize(size)}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Quantity */}
                            <div>
                                <p className="pb-3 text-sm font-semibold">Quantity:</p>
                                <div className="flex gap-3">
                                    <button
                                        className="border border-gray-100 btn bg-gray-200 p-1 text-xs"
                                        onClick={() => handleQuantity("minus")}
                                    >
                                        <FaMinus />
                                    </button>
                                    <span>{quantity}</span>
                                    <button
                                        className="border border-gray-100 btn bg-gray-200 p-1 text-xs"
                                        onClick={() => handleQuantity("plus")}
                                    >
                                        <FaPlus />
                                    </button>
                                </div>
                            </div>

                            {/* Add to Cart */}
                            <button
                                className={`bg-black rounded py-1 mt-2 btn hover:bg-gray-900 text-white ${isButtonDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
                                    }`}
                                onClick={handleAddToCart}
                                disabled={isButtonDisabled}
                            >
                                {!isButtonDisabled ? "Add to Cart" : "Adding..."}
                            </button>

                            {/* Characteristics */}
                            <div className="mt-9">
                                <p className="text-sm font-bold">Characteristics:</p>
                                <table className="w-full">
                                    <tbody>
                                        <tr>
                                            <td className="py-1">Brand</td>
                                            <td className="py-1">{selectedProducts.brand}</td>
                                        </tr>
                                        <tr>
                                            <td className="py-1">Material</td>
                                            <td className="py-1">{selectedProducts.material}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className='mt-10 mx-auto container'>
                        <h2 className='text-2xl font-bold mb-5 ml-5'>You May Also Like</h2>
                        <ProductGrid products={similarProducts} loading={loading} error={error} />
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProductDetails


