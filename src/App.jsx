import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import MainScreenComponent from './components/MainScreenComponent'
import HeaderComponent from './components/headers/HeaderComponent'
import RegisterUserComponent from './components/users/RegisterUserComponent'
import LoginUserComponent from './components/users/LoginUserComponent'
import PainelAdminComponent from './components/users/admin/PainelAdminComponent'
import ScreenAdminComponent from './components/users/admin/ScreenAdminComponent'
import ProductManageAdminComponent from './components/users/admin/products/ProductManageAdminComponent'
import ProductCreateAdminComponent from './components/users/admin/products/ProductCreateAdminComponent'
import UserManageAdminComponent from './components/users/admin/users/UserManageAdminComponent'
import UserCreateAdminComponent from './components/users/admin/users/UserCreateAdminComponent'
import DashboardAdminComponent from './components/users/admin/dashboard/DashboardAdminComponent'
import ProductDetailComponent from './components/products/ProductDetailComponent'
import CartComponent from './components/cart/CartComponent'
import ContinueBuyingComponent from './components/cart/shopping/ContinueBuyingComponent'
import PurchasedComponent from './components/cart/purchased/PurchasedComponent'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={
          <>
            <HeaderComponent />
            <MainScreenComponent />
          </>
        } />
        {/* Mostrar detalhes do produto clicado */}
        <Route path="/produtos/:id" element={<ProductDetailComponent />} />
        <Route path='/register' element={<RegisterUserComponent />} />
        <Route path='/login' element={<LoginUserComponent />} />
        <Route path='/painel' element={<PainelAdminComponent />} />
        <Route path='/admin' element={<ScreenAdminComponent />}>
          {/* Redirecionamento ao acessar /admin */}
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardAdminComponent />} />
          <Route path='users/manage' element={<UserManageAdminComponent />} />
          <Route path='users/create' element={<UserCreateAdminComponent />} />
          <Route path='products/manage' element={<ProductManageAdminComponent />} />
          <Route path='products/create' element={<ProductCreateAdminComponent />} />
        </Route>
        {/* Cart component */}
        <Route path='/cart' element={<CartComponent />} />
        <Route path='/continue-buying/:idCart' element={<ContinueBuyingComponent />} />
        <Route path='/purcharsed' element={<PurchasedComponent />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
