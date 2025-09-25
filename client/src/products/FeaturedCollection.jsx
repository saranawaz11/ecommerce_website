import React from 'react'
import { Link } from 'react-router'

function FeaturedCollection() {
  return (
    <div className='container mx-auto flex flex-col md:flex-row justify-center items-center px-2 lg:px-10'>
      {/* Left content */}
      <div className='md:w-1/2 w-full bg-green-100 p-2 lg:p-8 h-130 flex flex-col justify-center items-start rounded-l'>
        <p className='text-gray-700 font-semibold'>Comfort and Style</p>
        <h1 className='py-3 text-4xl font-semibold'>Apparel made for your everyday life</h1>
        <p className='text-sm text-gray-600'>Discover high-quality, comfortable clothing that effortlessly blends fashion and function. Designed to make you look and feel great every day.</p>
        <Link to='/collection/all' className='bg-black px-4 mt-3 py-2 rounded btn  border border-transparent hover:text-black hover:bg-transparent hover:border-black transform duration-200 text-white'>Shop Now</Link>
      </div>

      {/* Right Image */}
      <div className='w-full md:w-1/2'>
        <img src="https://i.pinimg.com/1200x/ae/87/86/ae878650c1acf3dedf2b89641dc0d44e.jpg" alt="Apparel" className='object-cover h-130 w-full rounded-r' /></div>
    </div>
  )
}

export default FeaturedCollection