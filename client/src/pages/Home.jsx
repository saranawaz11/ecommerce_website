import React from 'react'
import Hero from '../Layout/Hero'
import GenderCollection from '../products/GenderCollection'
import NewArrivals from '../products/NewArrivals'
import ProductDetails from '../products/ProductDetails'
import FeaturedCollection from '../products/FeaturedCollection'
import Features from '../Common/Features'
import { useState } from 'react'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProductsByFilters } from '../redux/slices/productsSlice'
import WomenCollection from '../products/WomenCollection'

function Home() {
  const dispatch = useDispatch()
  const { products, loading, error } = useSelector((state) => state.products)
  const [bestSellerProduct, setBestSellerProduct] = useState(null)
  
  useEffect(() => {
    // fetch products for a specife collection
    dispatch(fetchProductsByFilters({
      gender: 'Women',
      category: 'Bottom Wear',
      limit: 8
    }));
    // fetch best seller products
    const fetchBestSeller = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/best-seller`)
        setBestSellerProduct(response.data)
      } catch (error) {
        console.error(error);
      }
    };
    fetchBestSeller()
  }, [dispatch])

  return (
    <div>
      <Hero />
      <GenderCollection />
      <NewArrivals />

      {/* Best sellers */}
      <div className='container mx-auto my-5 text-center'>
        <h2 className='text-3xl font-bold '>Best Sellers</h2>
        {bestSellerProduct ? (<ProductDetails productId={bestSellerProduct._id}/>) : <p className='text-center'>Loading best seller products</p>}
      </div>

      {/* tOP WEAR FOR WOMEN */}
      <div className='container mx-auto mb-10 text-center'>
        <h2 className='text-3xl font-bold mb-3'>TOP WEARS FOR WOMEN</h2>
        <WomenCollection products={products} loading={loading} error={error}/>
      </div>
      <FeaturedCollection />
      <Features />
    </div>
  )
}

export default Home