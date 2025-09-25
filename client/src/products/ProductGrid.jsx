import React from 'react'
import { Link } from 'react-router'

function ProductGrid({ products, loading, error }) {
  if (loading) {
    return <p className='text-center'>Loading Products</p>
  }
  if (error) {
    return <p>Error: {error}</p>
  }
  return (
    <div className="w-[90%] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
      {
        products.map((product, index) => (
          <Link to={`/product/${product._id}`} key={index} className='flex pb-2 flex-col items-center bg-white rounded shadow-sm'>
            <img
              src={product.images[0].url}
              alt={product.images[0].altText}
              className="h-65 w-full object-top rounded rounded-bl-none rounded-br-none"
            />
            <p className="font-semibold my-2 text-center">{product.name}</p>
            <p className="text-sm font-semibold text-gray-600">
              ${product.price}
            </p>
          </Link>
        ))
      }
    </div>
  )
}

export default ProductGrid