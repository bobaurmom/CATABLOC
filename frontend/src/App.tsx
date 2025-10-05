import reactLogo from './assets/logo.svg'
import './App.css'
import './index.css'
import Footer from './component/layout/footer';
import Header from './component/layout/header';
function App() {
  
  return (
    <>
    <div className="app-container">
      <Header />
      <main className="main-content">
        <div style={{ textAlign: 'center', padding: '100px' }}>
          <img 
            src={reactLogo}
            alt="Cat" 
            style={{ width: '100px', height: 'auto' }} 
          />
          <h1>Start <br /> Your Learning Now</h1>
          <p>Explore the most fun game while learning algorithms</p>
          <button>Start Now</button>
        </div>
      </main>
      <Footer />
    </div>
    </>
  )
}


export default App