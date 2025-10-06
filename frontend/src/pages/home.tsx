import logo from '../assets/logo.svg';

function Home() {
    return (
        <main className="main-content">
        <div style={{ textAlign: 'center', padding: '100px' }}>
          <img 
            src={logo}
            style={{ width: '100px', height: 'auto' }} 
          />
          <h1>Start <br/> Your Learning Now</h1>
          <p>Explore the most fun game while learning algorithms</p>
          <button>
            <a 
              href="/dashboard" 
              className="start-button" 
              style={{ textDecoration: 'none', color: 'inherit' }}>
              Start Now
            </a>
          </button>


        </div>
      </main>
    )
}

export default Home