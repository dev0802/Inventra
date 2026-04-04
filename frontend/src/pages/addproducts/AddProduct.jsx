import React, { useState } from 'react'
export default function AddProduct() {
    const [showPopup, setShowPopup] = useState(false);
    return (
        <div className=' w-full'>
            <div className='bg-gradient-to-r from-gray-300 to-gray-500 shadow-lg shadow-gray-600 backdrop-blur-md border border-gray-400 rounded-2xl shadow-lg p-6 md:max-w-7xl md:min-h-4xl mx-auto '>
                <h2 className='text-gray-700 text-2xl font-bold mb-3'>Add Product</h2>
                <div className='flex flex-col gap-3'>
                    {/* Item Description */}
                    <div className='flex items-center gap-3'>
                        <label className='text-gray-700 text-md font-medium w-44'>Item Description</label>
                        <select className='flex-1 px-4 py-2 rounded-full border border-gray-400 bg-white/50 outline-none focus:border-gray-400 focus:shadow-md appearance-none cursor-pointer'>

                            <option value=''></option>

                        </select>
                        {/* Popup for adding new item description */}
                        <div className='relative'>
                            <button
                            onClick={() => setShowPopup(!showPopup)} 
                            className="peer px-4 py-2 rounded-full border border-gray-400 bg-white/50 outline-none hover:shadow-md">+</button>
                            {showPopup && (
                            <div className='absolute left-0 top-12 z-10 bg-gradient-to-r from-gray-300 to-gray-500 border border-gray-400 rounded-2xl shadow-lg p-4 w-80'>
                                <h3 className='text-gray-700 text-md font-bold mb-3'>Item Description</h3>
                                <input
                                    className='w-full px-4 py-2 rounded-full border border-gray-400 bg-white/50 outline-none focus:border-gray-400 focus:shadow-md mb-3'
                                    placeholder='Enter item description'
                                />
                                <button onClick={() => setShowPopup(!showPopup)} className='w-full text-white text-sm font-semibold px-4 py-2 rounded-full border border-white/40 bg-gradient-to-r from-gray-600 to-gray-700 hover:opacity-80 transition-all duration-200'>
                                    Add Item
                                </button>
                            </div>
                        )}
                        </div>
                        {/* Delete button for item description */}
                        <button className="px-4 py-2 rounded-full border border-gray-400 bg-white/50 outline-none hover:shadow-md">-</button>
                    </div>
                    {/* HSN Code */}
                    <div className='flex items-center gap-3'>
                        <label className='text-gray-700 text-md font-medium w-44 '>HSN Code</label>
                        <input className='flex-1 px-4 py-2 rounded-full border border-gray-400 bg-white/50 outline-none focus:border-gray-400 focus:shadow-md from-shadow-gray-300 to-shadow-gray-400' />
                    </div>
                    {/* Gross Weight */}
                    <div className='flex items-center gap-3'>
                        <label className='text-gray-700 text-md font-medium w-44 '>Gross Weight (Gms.)</label>
                        <input className='flex-1 px-4 py-2 rounded-full border border-gray-400 bg-white/50 outline-none focus:border-gray-400 focus:shadow-md from-shadow-gray-300 to-shadow-gray-400' />
                    </div>
                    {/* Stone Weight */}
                    <div className='flex items-center gap-3'>
                        <label className='text-gray-700 text-md font-medium w-44 '>Stone Weight (Gms.)</label>
                        <input className='flex-1 px-4 py-2 rounded-full border border-gray-400 bg-white/50 outline-none focus:border-gray-400 focus:shadow-md from-shadow-gray-300 to-shadow-gray-400' />
                    </div>
                    {/* Moti Weight */}
                    <div className='flex items-center gap-3'>
                        <label className='text-gray-700 text-md font-medium w-44 '>Moti Weight (Gms.)</label>
                        <input className='flex-1 px-4 py-2 rounded-full border border-gray-400 bg-white/50 outline-none focus:border-gray-400 focus:shadow-md from-shadow-gray-300 to-shadow-gray-400' />
                    </div>
                    {/* Diamond Weight */}
                    <div className='flex items-center gap-3'>
                        <label className='text-gray-700 text-md font-medium w-44 '>Diamond Weight (Ct.)</label>
                        <input className='flex-1 px-4 py-2 rounded-full border border-gray-400 bg-white/50 outline-none focus:border-gray-400 focus:shadow-md from-shadow-gray-300 to-shadow-gray-400' />
                    </div>
                    {/* Solitaire Weight */}
                    <div className='flex items-center gap-3'>
                        <label className='text-gray-700 text-md font-medium w-44 '>Solitaire Weight (Ct.)</label>
                        <input className='flex-1 px-4 py-2 rounded-full border border-gray-400 bg-white/50 outline-none focus:border-gray-400 focus:shadow-md from-shadow-gray-300 to-shadow-gray-400' />
                    </div>
                    {/* Color Stone */}
                    <div className='flex items-center gap-3'>
                        <label className='text-gray-700 text-md font-medium w-44 '>Color Stone (Gms.)</label>
                        <input className='flex-1 px-4 py-2 rounded-full border border-gray-400 bg-white/50 outline-none focus:border-gray-400 focus:shadow-md from-shadow-gray-300 to-shadow-gray-400' />
                    </div>
                    {/* Minna */}
                    <div className='flex items-center gap-3'>
                        <label className='text-gray-700 text-md font-medium w-44 '>Minna (Gms.)</label>
                        <input className='flex-1 px-4 py-2 rounded-full border border-gray-400 bg-white/50 outline-none focus:border-gray-400 focus:shadow-md from-shadow-gray-300 to-shadow-gray-400' />
                    </div>
                    {/* Colouring */}
                    <div className='flex items-center gap-3'>
                        <label className='text-gray-700 text-md font-medium w-44 '>Colouring (Gms.)</label>
                        <input className='flex-1 px-4 py-2 rounded-full border border-gray-400 bg-white/50 outline-none focus:border-gray-400 focus:shadow-md from-shadow-gray-300 to-shadow-gray-400' />
                    </div>
                    {/* Net Weight */}
                    <div className='flex items-center gap-3'>
                        <label className='text-gray-700 text-md font-medium w-44 '>Net Weight (Gms.)</label>
                        <input className='flex-1 px-4 py-2 rounded-full border border-gray-400 bg-white/50 outline-none focus:border-gray-400 focus:shadow-md from-shadow-gray-300 to-shadow-gray-400' />
                    </div>
                    {/* Price */}
                    <div className='flex items-center gap-3'>
                        <label className='text-gray-700 text-md font-medium w-44 '>Price (₹)</label>
                        <input className='flex-1 px-4 py-2 rounded-full border border-gray-400 bg-white/50 outline-none focus:border-gray-400 focus:shadow-md from-shadow-gray-300 to-shadow-gray-400' />
                    </div>
                    
                    <div className="mt-2 ">
                        <button className='text-white text-sm hover:shadow-xl shadow-gray-700 font-semibold px-4 py-2 rounded-full border border-white/40 bg-gradient-to-r from-gray-600 to-gray-700  transition-all duration-200'>
                            Reset
                        </button>
                        <button className='text-white text-sm hover:shadow-xl shadow-gray-700 font-semibold px-4 py-2 rounded-full border border-white/40 bg-gradient-to-r from-gray-600 to-gray-700 hover:bg-gradient-to-r hover:from-gray-700 hover:to-gray-800 transition-all duration-200 ml-3'>
                            Print only Label
                        </button>
                        <button className='text-white text-sm hover:shadow-xl shadow-gray-700 font-semibold px-4 py-2 rounded-full border border-white/40 bg-gradient-to-r from-gray-600 to-gray-700 hover:bg-gradient-to-r hover:from-gray-700 hover:to-gray-800 transition-all duration-200 ml-3'>
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

