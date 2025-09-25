import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';

function FilterSidebar() {

    const [searchParams, setSeacrhParams] = useSearchParams();
    const navigate = useNavigate();
    const [filters, setFilters] = useState({
        category: '',
        gender: '',
        color: [],
        size: [],
        material: [],
        brand: [],
        minPrice: 0,
        maxPrice: 100,
    });

    const [priceRange, setPriceRange] = useState([0, 100]);
    const categories = ['Top Wear', 'Bottom Wear'];
    const genders = ['Men', 'Women'];

    const colors = [
        'Red',
        'Blue',
        'Black',
        'Green',
        'Yellow',
        'Gray',
        'White',
        'Violet',
        'Pink',
        'Orange'
    ];

    const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    const materials = [
        'Cotton',
        'Wool',
        'Denim',
        'Polyester',
        'Silk',
        'Linen',
        'Viscose',
        'Fleece'
    ];

    const brands = [
        'Urban Threads',
        'Modern Fit',
        'Street Style',
        'Beach Breeze',
        'Fashionista',
        'ChicStyle'
    ];

    useEffect(() => {
        const params = Object.fromEntries([...searchParams]);
        setFilters({
            category: params.category || '',
            gender: params.gender || '',
            color: params.color || '',
            size: params.size ? params.size.split(',') : [],
            material: params.material ? params.material.split(',') : [],
            brand: params.brand ? params.brand.split(',') : [],
            minPrice: params.minPrice || 0,
            maxPrice: params.maxPrice || 100,
        });
        setPriceRange([0, params.maxPrice || 100]);
    }, [searchParams]);

    const handleFilterChange = (e) => {
        const { name, value, checked, type } = e.target || {};
        let newFilters = { ...filters };

        if (type === 'checkbox') {
            if (checked) {
                newFilters[name] = [...(newFilters[name] || []), value];
            } else {
                newFilters[name] = newFilters[name].filter((item) => item !== value);
            }
        } else {
            // For buttons like color
            if (Array.isArray(newFilters[name])) {
                if (newFilters[name].includes(value)) {
                    newFilters[name] = newFilters[name].filter((c) => c !== value);
                } else {
                    newFilters[name] = [...newFilters[name], value];
                }
            } else {
                newFilters[name] = value;
            }
        }

        setFilters(newFilters);
        updateURLParams(newFilters);
    };

    const updateURLParams = (newFilters) => {
        const params = new URLSearchParams();
        Object.keys(newFilters).forEach((key) => {
            if (Array.isArray(newFilters[key]) && newFilters[key].length > 0) {
                params.append(key, newFilters[key].join(','));
            } else if (newFilters[key]) {
                params.append(key, newFilters[key])
            }
        })
        setSeacrhParams(params);
        navigate(`?${params.toString()}`); // ?category=Bottom+Wear&size=XS%2CS
    }

    const handlePriceChange = (e) => {
        const newPrice = e.target.value;
        setPriceRange([0, newPrice]);
        const newFilters = { ...filters, minPrice: 0, maxPrice: newPrice };
        setFilters(newFilters);
        updateURLParams(newFilters);
    }

    return (
        <div className='mx-2 md:mx-4'>
            <h3 className='font-bold'>Filter</h3>

            {/* Category */}
            <div className='text-sm my-3'>
                <label className='font-bold pb-2 text-gray-700'>Category</label>
                {
                    categories.map((category) => (
                        <div key={category} className='mt-1 text-sm font-medium flex gap-1'>
                            <input className=''
                                type="radio"
                                name="category"
                                value={category}
                                checked={filters.category === category}
                                onChange={handleFilterChange} />
                            <span>{category}</span>
                        </div>
                    ))
                }
            </div>

            {/* Gender */}
            <div className='text-sm my-3'>
                <label className='font-bold pb-2 text-gray-700'>Gender</label>
                {
                    genders.map((gender) => (
                        <div key={gender} className='mt-1 text-sm font-medium flex gap-1'>
                            <input
                                className=''
                                type="radio"
                                name="gender"
                                value={gender}
                                onChange={handleFilterChange}
                                checked={filters.gender === gender} />
                            <span>{gender}</span>
                        </div>
                    ))
                }
            </div>

            {/* Color */}
            <div className='text-sm my-3'>
                <label className='font-bold pb-2 text-gray-700 '>Color</label>
                <div className='flex flex-wrap gap-0.5 md:gap-2 '>
                    {
                        colors.map((color) => (
                            <div key={color} className='mt-1 text-sm font-medium'>
                                <button
                                    type="button"
                                    className={`btn h-6 md:h-8 w-6 md:w-8 rounded-full border border-gray-400 
    ${filters.color.includes(color) ? 'ring-2 ring-blue-500' : ''}`}
                                    style={{ backgroundColor: color.toLowerCase() }}
                                    onClick={() =>
                                        handleFilterChange({ target: { name: 'color', value: color, type: 'button' } })
                                    }
                                />
                            </div>
                        ))
                    }
                </div>

                {/*Size */}
                <div className='text-sm my-3'>
                    <label className='font-bold pb-2 text-gray-700'>Size</label>
                    {
                        sizes.map((size) => (
                            <div key={size} className='mt-1 text-sm font-semibold flex gap-2'>
                                <input
                                    className='border-gray-400'
                                    type="checkbox"
                                    name="size"
                                    value={size}
                                    onChange={handleFilterChange}
                                    checked={filters.size.includes(size)} />
                                <span>{size}</span>
                            </div>
                        ))
                    }
                </div>

                {/* Material */}
                <div className='text-sm my-3'>
                    <label className='font-bold pb-2 text-gray-700'>Material</label>
                    {
                        materials.map((material) => (
                            <div key={material} className='mt-1 text-sm font-semibold flex gap-2'>
                                <input
                                    className='border-gray-400'
                                    type="checkbox"
                                    name="material"
                                    value={material}
                                    onChange={handleFilterChange}
                                    checked={filters.material.includes(material)} />
                                <span>{material}</span>
                            </div>
                        ))
                    }
                </div>

                {/* Brand */}
                <div className='text-sm my-3'>
                    <label className='font-bold pb-2 text-gray-700'>Brand</label>
                    {
                        brands.map((brand) => (
                            <div key={brand} className='mt-1 text-sm font-medium flex gap-2'>
                                <input
                                    className='border-gray-400'
                                    type="checkbox"
                                    name="brand"
                                    value={brand}
                                    onChange={handleFilterChange}
                                    checked={filters.brand.includes(brand)} />
                                <span>{brand}</span>
                            </div>
                        ))
                    }
                </div>

                {/* Price Range FIlter */}
                <div className='my-3 text-sm'>
                    <label className='font-bold pb-4 text-gray-700 '>Price Range</label>
                    <input
                        type="range"
                        name="priceRange"
                        min={0}
                        max={100}
                        className='w-full'
                        value={priceRange[1]}
                        onChange={handlePriceChange} />
                    <div className='flex text-xs text-gray-500 justify-between'>
                        <span>$0</span>
                        <span>${priceRange[1]}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FilterSidebar