import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import MainScreenComponent from './components/MainScreenComponent'
import HeaderComponent from './components/HeaderComponent'
import RegisterUserComponent from './components/users/RegisterUserComponent'
import LoginUserComponent from './components/users/LoginUserComponent'
import PainelAdminComponent from './components/users/admin/PainelAdminComponent'
import ScreenAdminComponent from './components/users/admin/ScreenAdminComponent'
import ProductAdminComponent from './components/users/admin/ProductAdminComponent'
import UserAdminComponent from './components/users/admin/UserAdminComponent'

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
        <Route path='/painel' element={<PainelAdminComponent />}/>
        <Route path='/admin' element={<ScreenAdminComponent />}>
          <Route path='users' element={<UserAdminComponent />}/>
          <Route path='products' element={<ProductAdminComponent />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
