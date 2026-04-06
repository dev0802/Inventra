import React, { useState } from 'react'
export default function AddProduct() {
    const [showPopup, setShowPopup] = useState(false);

    const numericInput = (e) => {
        const value = e.target.value.replace(/[^0-9.]/g, '');
        // Prevent multiple decimal points
        e.target.value = value.split('.').length > 2 ? value.replace(/\.+$/, '') : value;
        e.target.addEventListener('blur', (e) => {
            e.target.value = e.target.value.replace(/\.+$/, '');
        });
    };
    return (
        <div className=' w-full'>
            <div className='bg-gradient-to-r from-gray-300 to-gray-400 shadow-lg shadow-gray-600 backdrop-blur-md border border-gray-400 rounded-2xl shadow-lg p-6 md:max-w-7xl md:min-h-4xl mx-auto '>
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
                                className=" bg-transparent outline-none flex items-center justify-center text-gray-900">
                                <svg xmlns="http://www.w3.org/2000/svg" className='h-6 w-6' width="29" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path d="M12 5v14M5 12h14" />
                                </svg>
                            </button>
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
                        <button className="text-red-700  p-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                    {/* HSN Code */}
                    <div className='flex items-center gap-3'>
                        <label className='text-gray-700 text-md font-medium w-44 '>HSN Code</label>
                        <input
                            onChange={numericInput}
                            className='flex-1 px-4 py-2 rounded-full border border-gray-400 bg-white/50 outline-none focus:border-gray-400 focus:shadow-md from-shadow-gray-300 to-shadow-gray-400' />
                    </div>
                    {/* Gross Weight */}
                    <div className='flex items-center gap-3'>
                        <label className='text-gray-700 text-md font-medium w-44 '>Gross Weight (Gms.)</label>
                        <input
                            onChange={numericInput}
                            className='flex-1 px-4 py-2 rounded-full border border-gray-400 bg-white/50 outline-none focus:border-gray-400 focus:shadow-md from-shadow-gray-300 to-shadow-gray-400' />
                    </div>
                    {/* Stone Weight */}
                    <div className='flex items-center gap-3'>
                        <label className='text-gray-700 text-md font-medium w-44 '>Stone Weight (Gms.)</label>
                        <input
                            onChange={numericInput}
                            className='flex-1 px-4 py-2 rounded-full border border-gray-400 bg-white/50 outline-none focus:border-gray-400 focus:shadow-md from-shadow-gray-300 to-shadow-gray-400' />
                    </div>
                    {/* Moti Weight */}
                    <div className='flex items-center gap-3'>
                        <label className='text-gray-700 text-md font-medium w-44 '>Moti Weight (Gms.)</label>
                        <input
                            onChange={numericInput}
                            className='flex-1 px-4 py-2 rounded-full border border-gray-400 bg-white/50 outline-none focus:border-gray-400 focus:shadow-md from-shadow-gray-300 to-shadow-gray-400' />
                    </div>
                    {/* Diamond Weight */}
                    <div className='flex items-center gap-3'>
                        <label className='text-gray-700 text-md font-medium w-44 '>Diamond Weight (Ct.)</label>
                        <input
                            onChange={numericInput}
                            className='flex-1 px-4 py-2 rounded-full border border-gray-400 bg-white/50 outline-none focus:border-gray-400 focus:shadow-md from-shadow-gray-300 to-shadow-gray-400' />
                    </div>
                    {/* Solitaire Weight */}
                    <div className='flex items-center gap-3'>
                        <label className='text-gray-700 text-md font-medium w-44 '>Solitaire Weight (Ct.)</label>
                        <input
                            onChange={numericInput}
                            className='flex-1 px-4 py-2 rounded-full border border-gray-400 bg-white/50 outline-none focus:border-gray-400 focus:shadow-md from-shadow-gray-300 to-shadow-gray-400' />
                    </div>
                    {/* Color Stone */}
                    <div className='flex items-center gap-3'>
                        <label className='text-gray-700 text-md font-medium w-44 '>Color Stone (Gms.)</label>
                        <input
                            onChange={numericInput}
                            className='flex-1 px-4 py-2 rounded-full border border-gray-400 bg-white/50 outline-none focus:border-gray-400 focus:shadow-md from-shadow-gray-300 to-shadow-gray-400' />
                    </div>
                    {/* Minna */}
                    <div className='flex items-center gap-3'>
                        <label className='text-gray-700 text-md font-medium w-44 '>Minna (Gms.)</label>
                        <input
                            onChange={numericInput}
                            className='flex-1 px-4 py-2 rounded-full border border-gray-400 bg-white/50 outline-none focus:border-gray-400 focus:shadow-md from-shadow-gray-300 to-shadow-gray-400' />
                    </div>
                    {/* Colouring */}
                    <div className='flex items-center gap-3'>
                        <label className='text-gray-700 text-md font-medium w-44 '>Colouring (Gms.)</label>
                        <input
                            onChange={numericInput}
                            className='flex-1 px-4 py-2 rounded-full border border-gray-400 bg-white/50 outline-none focus:border-gray-400 focus:shadow-md from-shadow-gray-300 to-shadow-gray-400' />
                    </div>
                    {/* Net Weight */}
                    <div className='flex items-center gap-3'>
                        <label className='text-gray-700 text-md font-medium w-44 '>Net Weight (Gms.)</label>
                        <input
                            onChange={numericInput}
                            className='flex-1 px-4 py-2 rounded-full border border-gray-400 bg-white/50 outline-none focus:border-gray-400 focus:shadow-md from-shadow-gray-300 to-shadow-gray-400' />
                    </div>
                    {/* Price */}
                    <div className='flex items-center gap-3'>
                        <label className='text-gray-700 text-md font-medium w-44 '>Price (₹)</label>
                        <input
                            onChange={numericInput}
                            className='flex-1 px-4 py-2 rounded-full border border-gray-400 bg-white/50 outline-none focus:border-gray-400 focus:shadow-md from-shadow-gray-300 to-shadow-gray-400' />
                    </div>

                    <div className="mt-2 flex justify-end">
                        <button
                            type='reset'
                            className='text-white text-sm hover:shadow-xl shadow-gray-700 font-semibold px-4 py-2 rounded-full border border-white/40 bg-gradient-to-r from-gray-600 to-gray-700  transition-all duration-200'>
                            Reset
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

