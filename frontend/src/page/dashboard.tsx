import logo from '../assets/logo.svg';

function Dashboard() {
    return (
        <main className="main-content">
            <div className="dashboard-container">
                <div className="dashboard-header">
                    <img
                        src={logo}
                        alt="Logo"
                        style={{ width: '70px', height: 'auto', marginBottom: '10px' }}
                    />
                    <h1>Welcome back</h1>
                </div>
            </div>
        </main>
    )
}

export default Dashboard