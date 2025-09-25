import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom'
import { fetchOrderDetails } from '../redux/slices/orderSlice';
function OrderDetails() {
    const { id } = useParams();
    const dispatch = useDispatch()
    const { orderDetails, loading, error } = useSelector((state) => state.orders)

    useEffect(() => {
        dispatch(fetchOrderDetails(id))
    }, [dispatch, id])

    if (loading) return <p>Loading....</p>
    if (error) return <p>Error:- {error}</p>
    if (!orderDetails) {
        return <p>No order found...</p>
    }
    return (
        <div className='max-w-5xl mx-auto py-5'>
            <h1 className='font-bold text-xl'>Order Details</h1>
            <div className='border p-5 m-5 rounded border-slate-400'>
                {orderDetails && (
                    <div className=''>
                        <div className="flex justify-between">
                            <div className=''>
                                <p className='font-bold '>Order ID: #{orderDetails._id}</p>
                                <p className='text-sm text-slate-600'>{new Date(orderDetails.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <p className={`text-center rounded-md text-xs p-1 px-2 ${orderDetails.isPaid ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'}`}>{orderDetails.isPaid ? ('Approved') : 'Pending'}</p>

                                <p className={`text-center rounded-md mt-2 text-xs p-1 px-2 ${orderDetails.isDelivered ? 'bg-green-200 text-green-700' : 'bg-yellow-200 text-yellow-700'}`}>{orderDetails.isDelivered ? ('Delivered') : 'Pending Delivery'}</p>
                            </div>
                        </div>

                        <div className=' max-w-3xl mt-10 flex justify-between'>
                            <div className='w-1/2'>
                                <p className='font-bold tracking-wider mb-1'>Payment Info</p>
                                <p className='text-sm'>Payment Method: {orderDetails.paymentMethod}</p>
                                <p className='text-sm'>Status: {orderDetails.isPaid ? 'Paid' : 'Unpaid'}</p>
                            </div>
                            <div className='w-1/2'>
                                <p className='font-bold tracking-wider mb-1'>Shipping Info</p>
                                <p className='text-sm'>Shipping Method: Standard</p>
                                <p className='text-sm'>Address: {orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.country}</p>
                            </div>
                        </div>
                    </div>
                )}
                <h3 className='font-bold pt-3'>Products</h3>
                <div className=' mt-3 rounded'>
                    <table className=' w-full table-auto border-collapse overflow-hidden text-xs my-5 rounded shadow-md'>
                        <thead className=''>
                            <tr className='w-full bg-gray-300'>
                                <th className='py-2'>Name</th>
                                <th>Unit Price</th>
                                <th>Quantity</th>
                                <th>Total</th>
                            </tr>
                        </thead>

                        <tbody>
                            {
                                orderDetails.orderItems.map((item, index) => (
                                    <tr key={index} className='border-b border-slate-300'>
                                        <td className='flex py-3 px-5 gap-3 items-center'>
                                            <img src={item.image} className='w-15 h-15 rounded' />
                                            <p className='text-green-700 font-bold'>{item.name}</p>
                                        </td>

                                        <td className='text-slate-500'>${item.price}</td>

                                        <td className='text-slate-500'>{item.quantity}</td>

                                        <td className='text-slate-500'>${orderDetails.totalPrice}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                    <Link to='/profile' className='underline text-green-950 font-semibold'>Back to orders</Link>
                </div>
            </div>

        </div>
    )
}

export default OrderDetails