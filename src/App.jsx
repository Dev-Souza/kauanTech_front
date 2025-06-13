import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import MainScreenComponent from './components/MainScreenComponent'
import HeaderComponent from './components/HeaderComponent'
import RegisterUserComponent from './components/users/RegisterUserComponent'
import LoginUserComponent from './components/users/LoginUserComponent'
import PainelAdminComponent from './components/users/admin/PainelAdminComponent'
import ScreenAdminComponent from './components/users/admin/ScreenAdminComponent'
import ProductManageAdminComponent from './components/users/admin/products/ProductManageAdminComponent'
import ProductCreateAdminComponent from './components/users/admin/products/ProductCreateAdminComponent'
import UserManageAdminComponent from './components/users/admin/users/UserManageAdminComponent'
import UserCreateAdminComponent from './components/users/admin/users/UserCreateAdminComponent'
import DashboardAdminComponent from './components/users/admin/dashboard/DashboardAdminComponent'

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
      </Routes>
    </BrowserRouter>
  )
}

export default App
