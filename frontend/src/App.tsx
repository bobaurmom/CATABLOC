import { BrowserRouter,Route, Routes } from 'react-router-dom'
import './App.css'
import './index.css'
import Footer from './component/layout/footer';
import Header from './component/layout/header';
import Home from './page/home';
import Login from './page/auth/login';
import SignUp from './page/auth/signup';
import Dashboard from './page/dashboard';
import ProtectedRoute from './component/protectedRoute';
import { AuthProvider } from './contexts/authContext';
import LevelPage from './page/level';

function App() {

  return (
  <AuthProvider>
    <BrowserRouter>
    <div className="app-container">
      <Header />
      <Routes> 
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<SignUp />} />   
        <Route path='/dashboard' element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
       <Route path='/level1' element={<LevelPage />} />
      </Routes>
      <Footer />
    </div>
    </BrowserRouter>
  </AuthProvider>
  )
}


export default App