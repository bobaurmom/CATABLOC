import { BrowserRouter,Route, Routes } from 'react-router-dom'
import Footer from './component/layout/Footer';
import Header from './component/layout/Header';
import Home from './page/Home';
import Login from './page/auth/Login';
import Dashboard from './page/Dashboard';
import SignUp from './page/auth/Signup';;
import ForgotPassword from './page/auth/ForgotPassword';
import ProtectedRoute from './component/ProtectedRoute';
import { AuthProvider } from './contexts/authContext';
import { GameProvider } from './contexts/gameContext';
import PublicRoute from './component/PublicRoute';
import ErrorPage from './page/Error';
import { lazy, useEffect } from 'react';


const LevelPage = lazy(() => import('./page/Level'));
function App() {

  useEffect(() => {
    Promise.all([
      import('./page/Level'),
    ]).then(() => {
      console.log("Level page is Loaded");
    }).catch(error => {
      console.error("Error loading modules:", error);
    });
  }, [])
  return (
    <BrowserRouter>
      <AuthProvider>
        <GameProvider>
          <div className="min-h-screen flex flex-col bg-white">
            <Header />
            <Routes> 
              <Route path='/' element={<PublicRoute><Home /></PublicRoute>} />
              <Route path='/login' element={<PublicRoute><Login /></PublicRoute>} />
              <Route path='/register' element={<PublicRoute><SignUp /></PublicRoute>} /> 
              <Route path='/forgot-password' element={<PublicRoute><ForgotPassword /></PublicRoute>} /> 
              <Route path='/dashboard' element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path='/games/:gameId/level/:levelId' element={<ProtectedRoute><LevelPage /></ProtectedRoute>} />
              <Route path='*' element={<ErrorPage />} />
            </Routes>
            <Footer />
          </div>
        </GameProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}


export default App