import React from 'react'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router';
import { fetchAllOrders, updateOrderStatus } from '../redux/slices/adminOrderSlice';


function OrdersPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const { orders, loading, error } = useSelector((state) => state.adminOrders)

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/')
    } else {
      dispatch(fetchAllOrders())
    }
  }, [dispatch, user, navigate])

  const handleStatusChange = (orderId, status) => {
    dispatch(updateOrderStatus({ id: orderId, status }))
  }

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>
  return (
    <div>
      <div className='max-w-4xl m-4  lg:mx-auto lg:mt-10'>
        <h1 className='text-xl font-bold'>Order Management</h1>
        <div className='shadow-md mt-5 overflow-auto'>
          <table className='w-full rounded min-w-max'>
            <thead>
              <tr className='bg-gray-100 text-left w-full text-sm'>
                <th className='p-2'>ORDER ID</th>
                <th className='p-2'>CUSTOMER</th>
                <th className='p-2'>TOTAL PRICE</th>
                <th className='p-2'>STATUS</th>
                <th className='p-2'>ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {
                orders.map((item) => (
                  <tr key={item._id} className='text-sm hover:bg-slate-100/50 border-b border-slate-300'>
                    <td className='px-2 py-4 font-extrabold'>#{item._id}</td>
                    <td className='text-slate-700 px-2 py-4'>{item.user?.name || "Guest"}</td>
                    <td className='text-slate-700 font-bold px-2 py-4'>${item.totalPrice.toFixed(2)}</td>
                    <td className='px-2 py-4'>
                      <select name="status" value={item.status} onChange={(e) => handleStatusChange(item._id, e.target.value)} className='border font-bold p-1 outline-none btn text-sm rounded border-slate-400'>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Canceled">Canceled</option>
                      </select>
                    </td>
                    <td className='px-2 py-4'>
                      <button onClick={() => handleStatusChange(item._id, 'Delivered')} className='bg-green-600 text-white px-4 py-1 rounded hover:bg-green-600/80 btn active:bg-green-800/80'>Mark as Delivered</button>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default OrdersPage