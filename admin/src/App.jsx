import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import SideBar from './components/SideBar'
import { Routes, Route } from 'react-router-dom'
import Orders from './pages/Orders'
import Reviews from './pages/Reviews'
import List from './pages/List'
import Add from './pages/Add'
import Edit from './pages/Edit'
import Dashboard from './pages/Dashboard'
import StockManagement from './pages/StockManagement'
import ContactMessages from './pages/ContactMessages'
import Login from './components/Login'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'
export const currency = 'Rs.'

// Debug: Log environment variables
console.log('App.jsx loaded');
console.log('Environment variable VITE_BACKEND_URL:', import.meta.env.VITE_BACKEND_URL);
console.log('Exported backendUrl:', backendUrl);

const App = () => {

  const [token, setToken] = useState(localStorage.getItem('token')? localStorage.getItem('token'): '');

  useEffect(()=>{
      localStorage.setItem('token', token)
  },[token])




  return (
    <div className='bg-gray-50 min-h-screen'>
      <ToastContainer/>
      {token === ""
        ? <Login setToken={setToken}/>
        : <>
          <Navbar setToken={setToken}/>
          <hr />
          <div className='flex w-full'>
            <SideBar />
            <div className='w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base'>
              <Routes>
                <Route path='/' element={<Dashboard token={token}/>} />
                <Route path='/dashboard' element={<Dashboard token={token}/>} />
                <Route path='/add' element={<Add token={token}/>} />
                <Route path='/list' element={<List token={token}/>} />
                <Route path='/edit/:productId' element={<Edit token={token}/>} />
                <Route path='/stock' element={<StockManagement token={token}/>} />
                <Route path='/orders' element={<Orders token={token}/>} />
                <Route path='/reviews' element={<Reviews token={token}/>} />
                <Route path='/contact-messages' element={<ContactMessages token={token}/>} />
              </Routes>

            </div>

          </div>
        </>}

    </div>
  )
}

export default App