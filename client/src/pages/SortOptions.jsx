import React from 'react'
import { useSearchParams } from 'react-router-dom'

function SortOptions() {
    const [searchParams, setSearchParams] = useSearchParams();
    const handleSorting = (e) => {
        const sortBy = e.target.value;
        searchParams.set('sortBy', sortBy);
        setSearchParams(searchParams);
    };
  return (
    <div className='my-2 flex justify-end px-5'>
        <select 
        id="sort" 
        onChange={handleSorting} 
        value={searchParams.get('sortBy') || ''} className='border rounded p-1 text-sm font-semibold border-slate-400 focus:border-none'>
            <option value="">Default</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDescc">Price: High to Low</option>
            <option value="popularity">Popularity</option>
        </select>
    </div>
  )
}

export default SortOptions