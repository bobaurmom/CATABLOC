import { BrowserRouter,Route, Routes } from 'react-router-dom'
import './App.css'
import './index.css'
import Footer from './component/layout/footer';
import Header from './component/layout/header';
import Home from './page/home';
function App() {
  
  return (
    <BrowserRouter>
    <div className="app-container">
      <Header />
      <Routes> 
        <Route path='/' element={<Home />} />
        {/* <Route path="/login" element={<}></Route> */}
      </Routes>
      <Footer />
    </div>
    </BrowserRouter>
  )
}


export default App