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
import GameSelectionPanel from './component/game/gameSelectionPanel';
import { GameProvider } from './contexts/gameContext';

function App() {

  return (
    <BrowserRouter>
      <AuthProvider>
        <GameProvider>
          <div className="app-container min-h-screen flex flex-col justify-between">
            <Header />
            <Routes> 
              <Route path='/' element={<Home />} />
              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<SignUp />} />  
              <Route path='/dashboard' element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path='/level' element={<LevelPage />} />
            </Routes>
            <Footer />
          </div>
        </GameProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}


export default App