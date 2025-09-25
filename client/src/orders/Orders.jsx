import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchUserOrders } from '../redux/slices/orderSlice.js';

function Orders() {
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const { orders, loading, error } = useSelector((state) => state.orders)
    useEffect(() => {
        dispatch(fetchUserOrders())
    }, [dispatch])

    const handleRowClick = (orderId) => {
        navigate(`/order/${orderId}`)
    }
    if (loading) return <p>Loading....</p>
    if (error) return <p>Error: {error}</p>

    return (
        <div className='h-full mx-auto px-10 py-3'>
            <h1 className='text-2xl font-bold text-green-950'>My Orders</h1>

            <div className='h-full w-full shadow-md bg-gray-200 rounded-xl'>
                <table className='w-full table-auto border-collapse overflow-hidden text-xs mt-5 rounded-xl'>
                    <thead>
                        <tr className='text-left'>
                            <th className='py-2 px-6'>IMAGE</th>
                            <th className='py-2 px-6'>ORDER ID</th>
                            <th className='py-2 px-6'>CREATED</th>
                            <th className='py-2 px-6'>SHIPPING ADDRESS</th>
                            <th className='py-2 px-6'>ITEMS</th>
                            <th className='py-2 px-6'>PRICE</th>
                            <th className='py-2 px-6'>STATUS</th>
                        </tr>
                    </thead>
                    <tbody className='bg-white w-full'>
                        {
                            orders.length > 0 ? (
                                orders.map((item) => (
                                    <tr onClick={() => handleRowClick(item._id)} key={item._id} className='border-t hover:bg-slate-100 btn border-slate-400'>
                                        <td className='p-3'><img className='rounded' src={item.orderItems[0].image} alt={item.orderItems[0].name} width={50} height={50} /></td>
                                        <td className='p-3'>{item._id}</td>
                                        <td className='p-3'>{new Date(item.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className='p-3'>{item.shippingAddress ? `${item.shippingAddress.city}, ${item.shippingAddress.country}` : 'N/A'}</td>
                                        <td className='p-3'>{item.orderItems.length}</td>
                                        <td className='p-3'>{item.totalPrice}</td>
                                        <td>
                                            <span className={`rounded-full text-center ${item.isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} px-2 py-1 text-xs`}>{item.isPaid ? 'Approved' : 'Pending'}</span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr >
                                    <td colSpan={7} className='py-4 px-4 text-center text-gray-500'>You don't have any orders.</td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Orders