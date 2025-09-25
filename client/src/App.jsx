import React from 'react'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserLayout from './Layout/UserLayout';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import Register from './pages/Register';
import Profile from './pages/Profile';
import CollectionPage from './pages/CollectionPage';
import ProductDetails from './products/ProductDetails';
import Checkout from './Checkout/Checkout';
import ConfirmationOrder from './Checkout/ConfirmationOrder';
import Orders from './orders/Orders';
import OrderDetails from './orders/OrderDetails';
import AdminPageLayout from './admin/AdminPageLayout';
import AdminPage from './admin/AdminPage';
import UsersPage from './admin/UsersPage';
import ProductsPage from './admin/ProductsPage';
import OrdersPage from './admin/OrdersPage';
import EditProductsPage from './admin/EditProductsPage';
import { Toaster } from 'sonner';
import { Provider} from 'react-redux'
import store from './redux/store.js'
import ProtectedRoutes from './Common/ProtectedRoutes.jsx';

function App() {

  return (
    <Provider store={store}>
      <BrowserRouter>
      <Toaster toastOptions={
        {
          duration : 3000
        }
      }/>
        <Routes>
          {/* User layout */}
          <Route path='/' element={<UserLayout/>}>
            <Route index element={<Home/>}/>
            <Route path='/login' element={<LoginPage/>}/>
            <Route path='/register' element={<Register/>}/>
            <Route path='/profile' element={<Profile/>}/>
            <Route path='/collections/:collection' element={<CollectionPage/>}/>
            <Route path='/product/:id' element={<ProductDetails/>}/>
            <Route path='/checkout' element={<Checkout/>}/>
            <Route path='/order-confirmation' element={<ConfirmationOrder/>}/>
            <Route path='/my-orders' element={<Orders/>}/>
            <Route path='/order/:id' element={<OrderDetails/>}/>
          </Route>

          {/* Admin layout */}
          <Route path='/admin' element={
            <ProtectedRoutes role='admin'>
              <AdminPageLayout/>
            </ProtectedRoutes>
            }>
            <Route index element={<AdminPage/>}/>
            <Route path='/admin/users' element={<UsersPage/>}/>
            <Route path='/admin/products' element={<ProductsPage/>}/>
            <Route path='/admin/orders' element={<OrdersPage/>}/>
            <Route path='/admin/products/:id' element={<EditProductsPage/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  )
}

export default App
