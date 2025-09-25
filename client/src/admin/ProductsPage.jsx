import React from 'react'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { deleteProduct, fetchAdminProducts } from '../redux/slices/adminProductSlice';

function ProductsPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const { products, loading, error } = useSelector((state) => state.adminProducts)

  useEffect(() => {
    dispatch(fetchAdminProducts())
  }, [dispatch])
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete the product?')) {
      dispatch(deleteProduct(id))
    }
  }

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <div className=''>
      <div className='max-w-4xl m-4  lg:mx-auto lg:mt-10'>
        <h1 className='text-xl font-bold'>Product Management</h1>
        <div className='mt-10 shadow-md overflow-auto'>
          <table className='w-full rounded min-w-max'>
            <thead>
              <tr className='bg-gray-100 text-left w-full text-sm'>
                <th className='p-2'>NAME</th>
                <th className='p-2'>PRICE</th>
                <th className='p-2'>SKU</th>
                <th className='p-2'>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {
                products.length > 0 ? (
                  products.map((item) => (
                    <tr key={item._id} className='text-sm border-b hover:bg-slate-100/40 btn border-slate-300'>
                      <td className='px-2 py-3 font-bold'>{item.name}</td>
                      <td className='text-slate-700 px-2 py-3'>${item.price}</td>
                      <td className='text-slate-700 px-2 py-3'>{item.sku}</td>
                      <td className=' flex gap-2 items-center px-2 py-3 text-white'>
                        <button onClick={() => navigate(`/admin/products/${item._id}`)} className='bg-yellow-600 active:bg-yellow-700 btn px-1 rounded'>Edit</button>
                        <button onClick={() => handleDelete(item._id)} className='bg-red-600 active:bg-red-700 btn px-1 rounded'>Delete</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>You don't have any products.</tr>
                )
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ProductsPage