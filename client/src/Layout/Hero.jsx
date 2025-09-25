import React from 'react'
import { Link } from 'react-router'
import heroImage from '../assets/heroImage.jpg'
function Hero() {
  return (
    <div className='relative'>
      <img src={heroImage} className='h-[500px] w-full object-cover' alt="hero-image" />
      <div className='absolute top-0 text-center w-full bg-black/40 flex flex-col justify-center items-center text-white inset-0'>
        <h1 className='text-7xl pb-5'>Vacation <br />Ready</h1>
        <p className='text-sm pb-5'>Explore our vacation-ready outfits with fast worldwide shipping.</p>
        <Link to='#' className='bg-white btn text-black p-2 px-4 rounded border border-transparent hover:border-white hover:bg-transparent transform transition-all duration-300 hover:text-white'>Shop Now</Link>
      </div>
    </div>
  )
}

export default Hero