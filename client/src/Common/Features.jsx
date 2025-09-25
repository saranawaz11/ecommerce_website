import React from 'react'
import { FaShoppingBag } from 'react-icons/fa';
import { IoWalletOutline } from 'react-icons/io5';

function Features() {
    return (
        <div className='container mx-auto justify-center mt-15'>
            <div className='flex flex-col md:flex-row items-center justify-between w-[80%] mb-10 mx-auto'>
                {/* Feature 1 */}
                <div className='text-center my-10 flex flex-col justify-center items-center '>
                    <FaShoppingBag className='mb-7' />
                    <p className='font-semibold text-xs'>FREE INTERNATIONAL SHIPPING</p>
                    <p className='pt-3 text-sm text-gray-700'>On all orders over $100.00</p>
                </div>

                {/* Feature 2 */}
                <div className='text-center my-10 flex flex-col justify-center items-center '>
                    <FaShoppingBag className='mb-7' />
                    <p className='font-semibold text-xs'>45 DAYS RETURN</p>
                    <p className='pt-3 text-sm text-gray-700'>Money back guarantee.</p>
                </div>

                {/* Feature 3 */}
                <div className='text-center my-10 flex flex-col justify-center items-center '>
                    <IoWalletOutline className='mb-7' />
                    <p className='font-semibold text-xs'>SECURE CHECKOUT</p>
                    <p className='pt-3 text-sm text-gray-700'>100% secured checkout process</p>
                </div>
            </div>
        </div>
    )
}

export default Features