import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import MainScreenComponent from './components/MainScreenComponent'
import HeaderComponent from './components/HeaderComponent'
import RegisterUserComponent from './components/users/RegisterUserComponent'
import LoginUserComponent from './components/users/LoginUserComponent'
import PainelAdminComponent from './components/users/admin/PainelAdminComponent'
import ScreenAdminComponent from './components/users/admin/ScreenAdminComponent'

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
        <Route path='/admin' element={<ScreenAdminComponent />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
