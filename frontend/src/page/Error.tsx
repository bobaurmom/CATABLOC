import { Link } from 'react-router-dom';
const ErrorPage: React.FC = () => {
  return (
    <div className="error-page flex flex-col items-center justify-center h-screen text-center items-center gap-4">
        <h1 className="text-6xl font-bold text-red-500">404</h1>
        <p>Sorry, the page you are looking for does not exist.</p>
        <Link to="/" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Go back to Home
        </Link>
    </div>
  );
}

export default ErrorPage;