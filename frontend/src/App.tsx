import { BrowserRouter,Route, Routes } from 'react-router-dom'
import './App.css'
import './index.css'
import Footer from './components/layout/footer';
import Header from './components/layout/header';
import Home from './pages/home';
import Dashboard from './pages/dashboard';
function App() {
  
  return (
    <BrowserRouter>
    <div className="app-container">
      <Header />
      <Routes> 
        <Route path='/' element={<Home />} />
        <Route path='/dashboard' element={<Dashboard />} />
      </Routes>
      <Footer />
    </div>
    </BrowserRouter>
  )
}


export default App