import React from 'react'
import Hero from '../components/Hero'
import LatestCollection from '../components/LatestCollection'
import BestSeller from '../components/BestSeller'
import OurPolicy from '../components/OurPolicy'
import NewsLetterbox from '../components/NewsLetterbox'
import RecentlyViewed from '../components/RecentlyViewed'
import ProductComparison from '../components/ProductComparison'

const Home = () => {
  return (
    <div>
      <Hero />
      <LatestCollection />
      <BestSeller/>
      <RecentlyViewed />
      <OurPolicy/>
      <NewsLetterbox/>
      <ProductComparison />
    </div>
  )
}

export default Home