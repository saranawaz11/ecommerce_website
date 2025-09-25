import React from 'react'
import { Link } from 'react-router';
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react';
import { fetchAdminProducts } from '../redux/slices/adminProductSlice';
import { fetchAllOrders } from '../redux/slices/adminOrderSlice';
function AdminPage() {
    const dispatch = useDispatch()
    const { products, loading: productsLoading, error: productsError } = useSelector((state) => state.adminProducts)
    const {
        orders,
        totalOrders,
        totalSales,
        loading: ordersLoading,
        error: ordersError
    } = useSelector((state) => state.adminOrders)

    useEffect(() => {
        dispatch(fetchAdminProducts());
        dispatch(fetchAllOrders())
    }, [dispatch])
    return (
        <div className='mx-5'>
            <div className='max-w-5xl md:my-8 my-4 mx-5 lg:mx-auto'>
                <h1 className='text-xl font-bold'>Admin Dashboard</h1>
                {productsLoading || ordersLoading ? (
                    <p>Loading...</p>
                ) : productsError ? (
                    <p>Error fetching products:- {productsError}</p>
                ) : ordersError ? (
                    <p>Error fetching orders:- {ordersError}</p>
                ) : (
                    <div className='mt-5 gap-4 grid grid-cols-1 md:grid-cols-3'>
                        <div className='shadow-md p-3 font-bold'>
                            <h2>Revenue</h2>
                            <p>${totalSales.toFixed(2)}</p>
                        </div>
                        <div className='shadow-md p-3 font-bold'>
                            <h2>Total Orders</h2>
                            <p>{totalOrders}</p>
                            <Link to='/admin/orders' className='font-medium text-xs text-green-700'>Manage Orders</Link>
                        </div>
                        <div className='shadow-md p-3 font-bold'>
                            <h2>Total Products</h2>
                            <p>{products.length}</p>
                            <Link to='/admin/products' className='font-medium text-xs text-green-700'>Manage Products</Link>
                        </div>
                    </div>
                )}



                {/* recent orders */}
                <h2 className='font-bold my-5 text-xl'>Recent Orders</h2>
                <div className='h-full rounded overflow-auto scroll-auto'>
                    <div className='overflow-x-auto'>
                        <table className='md:w-full min-w-max  table-auto border-collapse overflow-hidden shadow-md text-xs mt-5 rounded'>
                            <thead className=''>
                                <tr className='text-left bg-slate-100'>
                                    <th className='py-2 px-3'>ORDER ID</th>
                                    <th className='py-2 px-3'>USER</th>
                                    <th className='py-2 px-3'>TOTAL PRICE</th>
                                    <th className='py-2 px-3'>STATUS</th>
                                </tr>
                            </thead>

                            <tbody className='text-left'>
                                {
                                    orders.length > 0 ? (
                                        orders.map((item) => (
                                            <tr key={item._id} className='text-left min-w-max border-b border-slate-400'>
                                                <td className='font-bold p-4'>{item._id}</td>
                                                <td className='text-sm text-slate-700 p-4'>  {item.user?.name || "Guest"}
                                                </td>
                                                <td className='font-medium text-slate-800 text-sm p-4'>${item.totalPrice.toFixed(2)}</td>
                                                <td className='text-sm font-medium text-slate-700 p-4'>{item.status}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td className='py-3 text-center' colSpan={4} >You don't have any previous orders</td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminPage