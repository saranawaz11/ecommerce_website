import React, { useEffect, useRef, useState } from 'react'
import { FaFilter } from 'react-icons/fa'
import FilterSidebar from '../products/FilterSidebar';
import SortOptions from './SortOptions';
import ProductGrid from '../products/ProductGrid';
import { useParams, useSearchParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsByFilters } from '../redux/slices/productsSlice';

function CollectionPage() {
    const { collection } = useParams()
    const [searchParams] = useSearchParams()
    const dispatch = useDispatch()
    const { products, loading, error } = useSelector((state) => state.products)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const sidebarRef = useRef(null);
    const toggleSideBar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    }

    useEffect(() => {
        const params = Object.fromEntries(searchParams.entries());
        dispatch(fetchProductsByFilters({ collections: collection, ...params }));
    }, [dispatch, collection, searchParams.toString()]);


    const handleClickOutside = (e) => {
        // close sidebar if clicked outside sidebar in phone view
        if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
            setIsSidebarOpen(false);
        }
    }

    useEffect(() => {
        // event listener for clicks
        document.addEventListener('mousedown', handleClickOutside);
        // clean event listener
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        };
    }, [])

    return (
        <div>
            {/* Filter button for small screen */}
            <button onClick={toggleSideBar} className='flex md:hidden btn hover:text-black/80 p-2 text-sm font-semibold items-center mx-auto'>
                <FaFilter className='mr-2' />Filters
            </button>
            {
                isSidebarOpen && (
                    <div ref={sidebarRef} className='overflow-y-auto scroll-auto w-1/2 inset-y-0 bg-white z-50 fixed top-0 p-2'>
                        <FilterSidebar />
                    </div>
                )
            }

            <div className="flex">
                {/* Sidebar - hidden on small, visible on md+ */}
                <div className="shadow-md md:w-[25%] lg:w-[20%] hidden md:block">
                    <FilterSidebar />
                </div>

                {/* Main content */}
                <div className="w-full md:w-[75%] lg:w-[80%]">
                    <h1 className="text-lg p-2 pt-5 font-extralight">ALL COLLECTIONS</h1>
                    <SortOptions />

                    {/* Products Grid */}
                    <ProductGrid products={products} loading={loading} error={error} />
                </div>
            </div>

        </div>
    )
}

export default CollectionPage