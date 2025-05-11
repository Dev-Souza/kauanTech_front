import { Route, Routes } from 'react-router-dom'
import './App.css'
import MainScreenComponent from './components/MainScreenComponent'
import HeaderComponent from './components/HeaderComponent'
import RegisterUserComponent from './components/users/RegisterUserComponent'
import LoginUserComponent from './components/users/LoginUserComponent'

function App() {
  return (
    <Routes>
      <Route path='/' element={
        <>
          <HeaderComponent />
          <MainScreenComponent />
        </>
      } />
      <Route path='/register' element={<RegisterUserComponent />} />
      <Route path='/login' element={<LoginUserComponent />} />
    </Routes>
  )
}

export default App
