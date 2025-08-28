import React from 'react'
import {Routes,Route} from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Collection from './pages/Collection'
import Contact from './pages/Contact'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Wishlist from './pages/Wishlist'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import PasswordReset from './pages/PasswordReset'
import PlaceOrder from './pages/PlaceOrder'
import Orders from './pages/Orders'
import Profile from './pages/Profile'
import PaymentSuccess from './pages/PaymentSuccess'
import PaymentCancelled from './pages/PaymentCancelled'
import EmailVerification from './pages/EmailVerification'  // Keep only the new code-based verification
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SearchBar from './components/SearchBar'
import Breadcrumb from './components/Breadcrumb'
import ErrorBoundary from './components/ErrorBoundary'
import BackToTop from './components/BackToTop'
import ProtectedRoute from './components/ProtectedRoute'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <ErrorBoundary>
      <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] min-h-screen flex flex-col'>
        <ToastContainer 
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <Navbar />
        <div className="hidden sm:block">

        </div>
        <SearchBar/>
        <Breadcrumb />
        <main className='flex-1'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/about' element={<About />} />
            <Route path='/collection' element={<Collection />} />
            <Route path='/contact' element={<Contact />} />
            <Route path='/product/:productId' element={<Product />} /> 
            <Route path='/cart' element={<Cart />} /> 
            <Route path='/wishlist' element={<Wishlist />} /> 
            <Route path='/login' element={<Login />} />
            <Route path='/forgot-password' element={<ForgotPassword />} />
            <Route path='/password-reset' element={<PasswordReset />} /> 
            <Route path='/place-order' element={
              <ProtectedRoute>
                <PlaceOrder />
              </ProtectedRoute>
            } />
            <Route path='/orders' element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            } />  
            <Route path='/profile' element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path='/payment-success' element={<PaymentSuccess />} />
            <Route path='/payment-cancelled' element={<PaymentCancelled />} />
            <Route path='/email-verification' element={<EmailVerification />} />  {/* Add this route */}
          </Routes>  
        </main>
        <Footer/>
        <BackToTop />
      </div>
    </ErrorBoundary>
  )
}

export default App