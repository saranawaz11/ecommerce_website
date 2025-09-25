import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react';
import { createCheckout } from '../redux/slices/checkoutSlice';
import axios from 'axios';
import { toast } from 'sonner';
function Checkout() {

    const [checkoutId, setCheckoutId] = useState(null)
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.auth)
    const { cart, loading, error } = useSelector((state) => state.cart)

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        postalCode: '',
        country: '',
        phone: ''
    });

    const getValues = (e) => {
        const inputName = e.target.name;
        const inputValue = e.target.value;

        let oldData = { ...formData };
        oldData[inputName] = inputValue;
        setFormData(oldData);

    }

    //ensure cart is loaded before proceeding
    useEffect(() => {
        if (!cart || !cart.orderItems || cart.orderItems.length === 0) {
            navigate('/')
        }
    }, [cart, navigate])

    const handleCreateCheckout = async (e, method) => {
        e.preventDefault();
        if (cart && cart.orderItems.length > 0) {
            const res = await dispatch(
                createCheckout({
                    orderItems: cart.orderItems,
                    shippingAddress: formData,
                    paymentMethod: method,
                    totalPrice: cart.totalPrice
                })
            );

            if (res.payload && res.payload._id) {
                setCheckoutId(res.payload._id);
            }
        }

    }

    const handlePaymentSuccess = async (details) => {
        try {
            const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/pay`, { paymentStatus: details.status, paymentDetails: details }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('userToken')}`
                }
            });
            await handleFinalizeCheckout(checkoutId); //finalize checkout if payment is successful
            return response.data
        } catch (error) {
            console.error(error);
        }
    }
    const handleFinalizeCheckout = async (checkoutId) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/finalize`, {}, {
                headers:
                {
                    Authorization: `Bearer ${localStorage.getItem('userToken')}`
                }
            });
            navigate('/order-confirmation')
            return response.data
        } catch (error) {
            console.error(error)
        }
    }

    if (loading) return <p>Loading cart...</p>
    if (error) return <p>Error: {error}</p>
    if (!cart || !cart.orderItems || cart.orderItems.length === 0) {
        return <p>Your Cart Is Empty.</p>
    }

    if(cart.response === 404){
        toast.error('Please Fill Out aAll Fielda')
    }
    return (
        <div className='gap-5 grid grid-cols-2 py-10 px-20'>
            {/* left */}
            <div className=''>
                <form className='px-5 rounded-md' onSubmit={handleCreateCheckout}>
                    <h1 className='text-xl mb-2 font-bold'>CHECKOUT</h1>
                    <h3 className='font-semibold tracking-wide mb-1'>Contact Details</h3>

                    <label htmlFor="email" className='block mb-1 mt-3 text-sm'>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={user ? user.email : ''}
                        disabled
                        className='border outline-none p-2 w-full rounded-md text-sm' />

                    <h3 className='font-semibold tracking-wide mt-3 mb-1'>Delivery</h3>
                    <div className='flex b-1 mt-3 gap-2 w-full'>
                        <div className='w-1/2'>
                            <label className='block mb-1 text-sm' htmlFor="firstname">First name</label>
                            <input
                                type="text"
                                name="firstName"
                                required
                                value={formData.firstName}
                                onChange={getValues}
                                className='w-full border outline-none text-sm p-2 rounded-md' />
                        </div>
                        <div className='w-1/2'>
                            <label className='block text-sm mb-1' htmlFor="lastname">Last name</label>
                            <input
                                type="text"
                                name="lastName"
                                required
                                value={formData.lastName}
                                onChange={getValues}
                                className='w-full border outline-none text-sm p-2 rounded-md' />
                        </div>
                    </div>

                    <label htmlFor="address" className='block mb-1 mt-3 text-sm'>Address</label>
                    <input
                        type="address"
                        name="address"
                        value={formData.address}
                        onChange={getValues}
                        required
                        className='border outline-none p-2 w-full rounded-md text-sm' />

                    <div className='flex b-1 mt-3 gap-2 w-full'>
                        <div className='w-1/2'>
                            <label className='block mb-1 text-sm' htmlFor="city">City</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={getValues}
                                required
                                className='w-full border outline-none text-sm p-2 rounded-md' />
                        </div>
                        <div className='w-1/2'>
                            <label className='block text-sm mb-1' htmlFor="postal">Postal Code</label>
                            <input
                                type="text"
                                name="postalCode"
                                value={formData.postalCode}
                                onChange={getValues}
                                required
                                className='w-full border outline-none text-sm p-2 rounded-md' />
                        </div>
                    </div>

                    <label htmlFor="country" className='block mb-1 mt-3 text-sm'>Country</label>
                    <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={getValues}
                        required
                        className='border outline-none p-2 w-full rounded-md text-sm' />

                    <label htmlFor="phone" className='block mb-1 mt-3 text-sm'>Phone</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={getValues}
                        required
                        className='border outline-none p-2 w-full rounded-md text-sm' />

                    <div>
                        {!checkoutId ? (
                            <div className='mt-5 flex flex-col text-white gap-3'>
                                <button
                                    type='button'
                                    className="border border-black-400 bg-black hover:bg-black/80 active:bg-black-400/60 text-white py-1 rounded-md"
                                    onClick={(e) => handleCreateCheckout(e, "Online")}
                                >
                                    Pay With Card
                                </button>
                                <button
                                    type='button'
                                    onClick={(e) => handleCreateCheckout(e, "COD")}
                                    className="border border-gray-400 bg-gray-200 hover:bg-gray-300/80 active:bg-gray-400/60 text-black py-1 rounded-md"
                                >
                                    Cash On Delivery
                                </button>
                            </div>
                        ) : (
                            <div className='mt-5 flex flex-col text-white gap-3 '>
                                <button
                                    type='button'
                                    className="border border-black-400 bg-black hover:bg-black/80 active:bg-black-400/60 text-white py-1 rounded-md"
                                    onClick={() => handlePaymentSuccess({ method: "Online", status: 'Paid' })}
                                >
                                    Confirm Card Payment
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handlePaymentSuccess({ method: "COD", status: 'Unpaid' })}
                                    className="border border-gray-400 bg-gray-200 hover:bg-gray-300/80 active:bg-gray-400/60 text-black py-1 rounded-md"
                                >
                                    Confirm COD
                                </button>
                            </div>
                        )}
                    </div>

                </form>
            </div>

            {/* right */}
            <div className='bg-gray-100 p-5 py-7'>
                <h3 className='text-lg'>Order Summary</h3>
                <div className='border-b border-t border-slate-300 mt-5'>
                    {
                        cart.orderItems.map((item, index) => (
                            <div key={index} className='my-2 flex'>
                                <img src={item.image} alt={item.name} className='w-20 rounded h-20' />
                                <div className='flex justify-between w-full text-sm pl-4'>
                                    <div>
                                        <h3 className='font-semibold'>{item.name}</h3>
                                        <p className='text-xs text-gray-700'>Size: {item.size}</p>
                                        <p className='text-xs text-gray-700'>Color: {item.color}</p>
                                    </div>
                                    <span className='text-gray-800'>${item.price}</span>
                                </div>
                            </div>
                        ))
                    }
                </div>

                <div className='border-b border-slate-300'>
                    <div className='flex justify-between py-2 items-center'>
                        <p>Subtotal</p>
                        <p>$ {cart.totalPrice?.toLocaleString()}</p>
                    </div>
                    <div className='flex justify-between py-2 items-center'>
                        <p>Shipping</p>
                        <p className='text-sm'>FREE</p>
                    </div>
                </div>

                <div className='flex justify-between items-center my-2'>
                    <p>Total</p>
                    <p>$ {cart.totalPrice?.toLocaleString()}</p>
                </div>
            </div>
        </div>
    )
}

export default Checkout