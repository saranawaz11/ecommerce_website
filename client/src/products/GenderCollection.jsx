import React from 'react'
import { Link } from 'react-router'
import { Image, ImageKitProvider } from '@imagekit/react';

function GenderCollection() {
    return (
        <ImageKitProvider urlEndpoint="https://ik.imagekit.io/xkcfztwkzl/">
            <div className='md:p-10 p-3'>
                <div className='container mx-auto flex md:flex-row flex-col gap-5'>
                    {/* Women Collection */}
                    <Link to='/collections/all?gender=Women' className='w-full relative'>
                        <Image src='/pexels-photo-1839904.jpeg' className='rounded h-[300px] md:h-[450px] w-full object-cover' alt="women-collection" />
                        <div className='absolute bottom-5 rounded left-5 bg-white inline-block p-2 text-sm '>
                            <p>Women's Collection</p>
                            <p className='underline hover:text-slate-700'>Shop Now</p>
                        </div>
                    </Link>
                    {/* Men collection */}
                    <Link to='/collections/all?gender=Men' className='w-full relative'>
                        <Image src='/men-collection.jpg' className='rounded h-[300px] md:h-[450px] w-full object-cover' />
                        <div className='absolute bottom-5 rounded left-5 bg-white inline-block p-2 text-sm '>
                            <p>Men's Collection</p>
                            <p className='underline hover:text-slate-700'>Shop Now</p>
                        </div>
                    </Link>
                </div>
            </div>
        </ImageKitProvider>
    )
}

export default GenderCollection