import { useContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import SideNavbar from './pages/Navbar/SideNavbar';
import { MyContext } from './context/MyContext';
import ApprovedPosts from './pages/Dashboard/ApprovedPosts';
import RejectedPosts from './pages/Dashboard/RejectedPosts';
import Sales from './pages/Dashboard/Sales';
import AdminDashboard from './pages/Admin/AdminDashboard';
import Users from './pages/Admin/Posts';
import Spinner from './components/Loaders/Spinner';
import PaymentSuccessfull from './pages/PaymentSuccessfull';
import PaymentCancelled from './pages/PaymentCancelled';
import Posts from './pages/Admin/Posts';

function App() {
  const { loader, setloader } = useContext(MyContext)
  useEffect(() => {
    setloader(true)
  }, [])

  return (
    <>
      {loader ? <Spinner /> : <>
        <Router>
          <div className="grid grid-cols-[auto,1fr] h-screen">
            <SideNavbar className="hidden sm:block" />
            <div className="flex-grow p-4 ml-0 sm:ml-[20vw] md:ml-[15vw]">
              <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/dashboard/approvedposts' element={<ApprovedPosts />} />
                <Route path='/dashboard/rejectedPosts' element={<RejectedPosts />} />
                <Route path='/dashboard/sales' element={<Sales />} />
                <Route path='/admin' element={<AdminDashboard />} />
                <Route path='/admin/posts' element={<Posts />} />
                <Route path='/payments/successfull' element={<PaymentSuccessfull />} />
                <Route path='/payments/cancelled' element={<PaymentCancelled />} />

              </Routes>
            </div>
          </div>
        </Router>
      </>}


    </>

  );
}

export default App;
