// Thanh header cố định
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            RecruitX
          </Link>
          
          <nav className="flex gap-6 items-center">
            <Link to="/jobs" className="hover:text-blue-600">Jobs</Link>
            
            {user ? (
              <>
                <Link to={`/${user.role.toLowerCase()}/profile`} className="hover:text-blue-600">
                  Profile
                </Link>
                <button onClick={logout} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-blue-600">Login</Link>
                <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
