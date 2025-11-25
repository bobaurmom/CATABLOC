import { BrowserRouter,Route, Routes } from 'react-router-dom'
import './App.css'
import './index.css'
import Footer from './component/layout/footer';
import Header from './component/layout/header';
import Home from './page/home';
import Login from './page/auth/login';
import SignUp from './page/auth/signup';
import Verification from './component/ui/verification';
import Dashboard from './page/dashboard';
import ProtectedRoute from './component/protectedRoute';
import { AuthProvider } from './contexts/authContext';
function App() {

  return (
  
    <BrowserRouter>
    <AuthProvider>
    <div className="app-container">
      <Header />
      <Routes> 
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<SignUp />} />   
        <Route path='/dashboard' element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      </Routes>
      <Footer />
    </div>
    </AuthProvider>
    </BrowserRouter>
  )
}


export default App