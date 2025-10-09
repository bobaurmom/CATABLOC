import { BrowserRouter,Route, Routes } from 'react-router-dom'
import './App.css'
import './index.css'
import Footer from './component/layout/footer';
import Header from './component/layout/header';
import Home from './page/home';
import Login from './page/auth/login';
import SignUp from './page/auth/singup';
function App() {
  
  return (
    <BrowserRouter>
    <div className="app-container">
      <Header />
      <Routes> 
        <Route path='/' element={<Home />} />
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/signUp" element={<SignUp/>} ></Route>
      </Routes>
      <Footer />
    </div>
    </BrowserRouter>
  )
}


export default App