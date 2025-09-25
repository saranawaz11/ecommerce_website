import React from 'react'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { clearCart } from '../redux/slices/cartSlice';

function ConfirmationOrder() {

    const { user, guestId } = useSelector((state) => state.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { checkout } = useSelector((state) => state.checkout)
    useEffect(() => {
        if (checkout && checkout._id) {
            dispatch(clearCart())
            localStorage.removeItem('cart')
        } else {
            navigate('/my-orders')
        }
    }, [checkout, dispatch, navigate, user, guestId])

    const calculateEstimatedDelivery = (createdAt) => {
        const orderDate = new Date(createdAt);
        orderDate.setDate(orderDate.getDate() + 7);
        return orderDate.toLocaleDateString();
    }

    return (
        <div className='max-w-3xl mx-auto p-5'>
            <h1 className='text-center text-2xl font-bold text-green-900 mb-5'>Thank You For Your Order!</h1>
            {checkout && (
                <div className='border p-5 rounded border-slate-400'>
                    <div className='flex text-sm justify-between'>
                        <div >
                            <p className='font-bold'>OrderID: {checkout._id}</p>
                            <p className='text-slate-700'>Order date: {new Date(checkout.createdAt).toLocaleDateString()}</p>
                        </div>
                        <p className='font-medium text-green-800'>Estimated Delivery: {calculateEstimatedDelivery(checkout.createdAt)} </p>
                    </div>

                    <div className='mt-15'>
                        {
                            checkout.orderItems.map((item) => (
                                <div className='text-sm flex justify-between' key={item.productId}>
                                    <div className='mt-2 gap-2 flex items-center'>
                                        <img src={item.image} alt={item.name} className='w-18 h-18 object-cover rounded' />
                                        <div className=''>
                                            <p className='font-bold'>{item.name}</p>
                                            <p className='text-slate-500 text-xs'>{item.color} | {item.size}</p>
                                        </div>
                                    </div>
                                    <div className='text-xs'>
                                        <p className='font-bold '>${item.price}</p>
                                        <p className='text-slate-500'>Qty: {item.quantity}</p>
                                    </div>
                                </div>
                            ))
                        }
                    </div>

                    <div className='mt-15 text-sm flex'>
                        <div className='w-1/2'>
                            <p className='font-bold'>Payment</p>
                            <p>{checkout.paymentStatus}</p>
                        </div>
                        <div className='w-1/2'>
                            <p className='font-bold'>Delivery</p>
                            <p className='text-xs'>{checkout.shippingAddress.address}</p>
                            <p className='text-xs'>{checkout.shippingAddress.city}, {checkout.shippingAddress.country}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ConfirmationOrder