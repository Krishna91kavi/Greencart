import React from 'react'
import MainBanner from '../Components/MainBanner'
import Categories from '../Components/categories'
import BestSeller from '../Components/BestSeller'
import BottomBanner from '../Components/BottomBanner'
import NewsLetter from '../Components/NewsLetter'
import Footer from '../Components/Fotter'

const Home = () => {
  return (
    <div className='mt-10'>
        <MainBanner />
        <Categories />
        <BestSeller />
        <BottomBanner />
        <NewsLetter />
        
    </div>

  )
}

export default Home