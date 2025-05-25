import React from 'react'
import { useAppContext } from '../Context/AppContext'
import { useParams } from 'react-router-dom';
import { categories } from '../assets/assets.js';
import ProductCard from '../Components/ProductCard';


const ProductCategory = () => {

    const {products} = useAppContext();
    const {category} = useParams()

    const searchCategory = categories.find((item)=>item.path.toLowerCase() === category)

    const filteredProducts= products.filter((product)=>product.category.toLowerCase() === category)
  return (
    <div className='mt-16 '>
        {searchCategory && (
            <div className='flex flex-cols items-end w-max'> 
                 <p className='text-2xl font-medium'>{searchCategory.text.toUpperCase()}
                 <div className='h-0.5 bg-primary rounded-full '></div>   
                 </p>  
            
            </div>
        )}
        {filteredProducts.length > 0 ?(
             <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-5 lg:grid-cols-5 mt-6'>
            {filteredProducts.map((product)=>(
                <ProductCard key={product._id} product={product} />
            ))}
            </div>
        ):(
            <div className='flex items-center justify-center h-[60vh]' >
                <p className='text-3xl font-medium text-primary'> Oops 🤷‍♀️ No Products found in this category ! </p>
            </div>
        )
        }

    </div>
  )
}

export default ProductCategory