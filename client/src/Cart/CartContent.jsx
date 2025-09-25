import React from 'react'
import { FaMinus } from 'react-icons/fa6';
import { FaPlus } from 'react-icons/fa';
import { AiOutlineDelete } from 'react-icons/ai';
import { useDispatch } from 'react-redux';
import { deleteCartItem, updateCart } from '../redux/slices/cartSlice';


function CartContent({ cart, userId, guestId }) {
  const dispatch = useDispatch()

  const handleAddToCart = (productId, delta, quantity, size, color) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1) {
      dispatch(updateCart({
        productId,
        quantity: newQuantity,
        size,
        guestId,
        userId,
        color
      }))
    }
  }
  const handleRemoveFromCart = (productId, size, color) => {
    dispatch(deleteCartItem({
      productId,
      size,
      color,
      guestId,
      userId,
    }))
  }
  return (
    <div className='flex flex-col gap-3'>
      {
        cart?.orderItems?.map((items) => (
          <div key={items._id} className='flex justify-between items-start pb-1 border-b'>
            <div className='flex gap-3'>
              <img src={items.image} alt="item-1" className='rounded h-20 w-20' />
              <div className='text-sm '>
                <p>{items.name}</p>
                <p className='text-slate-600'>size:{items.size} | color: {items.color}</p>
                <div className='flex gap-3 mt-3 items-center text-xs'>
                  <button className='btn'
                    onClick={() => handleAddToCart(items.productId.toString(), -1, items.quantity, items.size, items.color)}
                  >
                    <FaMinus />
                  </button>
                  <p className='text-sm'>{items.quantity}</p>
                  <button onClick={() => handleAddToCart(items.productId.toString(), 1, items.quantity, items.size, items.color)} className='btn' ><FaPlus /></button>
                </div>
              </div>
            </div>
            <div>
              <p>$ {items.price.toLocaleString()}</p>
              <button onClick={() => handleRemoveFromCart(items.productId, items.size, items.color)} className='text-red-800 text-lg mt-1 btn'><AiOutlineDelete /></button>
            </div>
          </div>
        ))
      }
    </div>
  )
}

export default CartContent