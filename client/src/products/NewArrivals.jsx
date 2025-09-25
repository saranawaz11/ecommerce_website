import React, { useEffect, useRef, useState } from 'react'
import { MdNavigateBefore } from 'react-icons/md';
import { MdNavigateNext } from 'react-icons/md';
// import { Image, ImageKitProvider } from '@imagekit/react';
import { Link } from 'react-router';
import axios from 'axios';


function NewArrivals() {

    const scrollRef = useRef(null);
    const [leftScroll, setLeftScroll] = useState(false);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);

    const [newArrivals, setNewArrivals] = useState([]);
    useEffect(() => {
        const fetchNewArrivals = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/new-arrivals`)
                setNewArrivals(response.data)
            } catch (error) {
                console.error(error);
            }
        }
        fetchNewArrivals()
    }, [])
    // Up date scroll button
    const updateScrollButtons = () => {
        const container = scrollRef.current;
        if (container) {
            const scrollLeft = container.scrollLeft;
            const scrollRight = container.scrollWidth > scrollLeft + container.clientWidth;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollRight);
        }
    };

    useEffect(() => {
        const container = scrollRef.current;
        if (container) {
            container.addEventListener('scroll', updateScrollButtons);
            updateScrollButtons();
        }
        return () => {
            if (container) {
                container.removeEventListener('scroll', updateScrollButtons);
            }
        };
    }, [newArrivals]);

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setLeftScroll(scrollRef.current.scrollLeft);
    }

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = x - startX;
        scrollRef.current.scrollLeft = leftScroll - walk;
    }

    const handleMouseUpOrLeave = () => {
        setIsDragging(false);
    }

    const scroll = (direction) => {
        const scrollAmount = direction === 'left' ? -300 : 300;
        scrollRef.current.scrollBy({ left: scrollAmount, behaviour: 'smooth' });
    }

    return (
        <div className='p-4 md:p-10'>
            <h1 className='text-center font-bold text-2xl mb-2'>Explore New Arrivals</h1>
            <p className='text-center text-sm text-slate-800'>Discover the latest styles straight off the runway, freshly added to keep your wardrobe on the cutting edge of fashion.</p>
            {/* Scrolling button */}
            <div className='flex justify-end gap-2 pb-3'>
                <button className={`shadow-md  text-center rounded-[100%] text-lg p-2 ${canScrollLeft ? 'bg-white text-black btn' : 'bg-slate-300 cursor-not-allowed'}`} onClick={() => scroll('left')} disabled={!canScrollLeft}>
                    <MdNavigateBefore />
                </button>
                <button className={`shadow-md text-center rounded-[100%] text-lg p-2 ${canScrollRight ? 'bg-white text-black btn' : 'bg-slate-300 cursor-not-allowed'}`} onClick={() => scroll('right')} disabled={!canScrollRight}>
                    <MdNavigateNext />
                </button>
            </div>

            {/* Scrollbar area */}
            <div ref={scrollRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUpOrLeave}
                onMouseLeave={handleMouseUpOrLeave}
                className={`flex gap-5 w-full overflow-x-auto scrollbar-thin scroll-smooth ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`} >
                {
                    newArrivals.map((img, index) => (
                        <Link to={`/product/${img._id}`} key={index} className='w-[400px] relative bg-orange-200 flex-shrink-0 scrollbar-hide scrollbar-thin'>
                            <img src={img.images[0].url} alt={img.name} className='w-full h-[400px] object-cover rounded' draggable={false} />
                            <div className='bg-black/40 p-4 text-white absolute bottom-0 w-full'>
                                <p className='text-smibold'>{img.name}</p>
                                <p>$ {img.price}</p>
                            </div>
                        </Link>
                    ))
                }
            </div>
        </div>
    )
}

export default NewArrivals