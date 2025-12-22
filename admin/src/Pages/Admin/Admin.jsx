import React from 'react'
import Sidebar from '../../Components/Sidebar/Sidebar'
import { Route, Routes, Navigate, Router } from 'react-router-dom'
import AddProduct from '../../Components/Addproducts/AddProduct'
import ListProduct from '../../Components/ListProduct/ListProduct'
import './Admin.css'
import OrdersPage from '../../Components/OrderPage/OrdersPage'
import UpdateProduct from '../UpdatedProduct'
const Admin = () => {
  const token = localStorage.getItem('adminToken');
  if (!token) return <Navigate to="/adminlogin" />;

  return (
    <div className="admin">
      <Sidebar />
      <Routes>
        <Route path="/addproduct" element={<AddProduct />} />
        <Route path="/listproduct" element={<ListProduct />} />
        <Route path="/orderspage" element={<OrdersPage/>}/>
         <Route path="/updateproduct" element={<UpdateProduct />} />
      </Routes>
    </div>
  );
};

export default Admin;
