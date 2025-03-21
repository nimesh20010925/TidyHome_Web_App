import React from 'react'
import HomeSummary from './HomeModals/HomeSummary';
import SpecialNotices from './HomeModals/SpecialNotices';
import ShoppingDashboard from './HomeModals/ShoppingDashboard';
import ShoppingListDisplay from './HomeModals/ShoppingListDisplay';


const Home = () => {
  return (
    <div>
      
      <SpecialNotices/>
      <HomeSummary/>
      <ShoppingDashboard/>
      <ShoppingListDisplay/>
    </div>
  )
}

export default Home;