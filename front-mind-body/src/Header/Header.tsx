import { useContext, useState } from "react";
import { User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import ProfileModal from "../ProfileModal/ProfileModal";


import "../Header/Header.css";
import Logo1 from "../assets/Logo1.png";

const Header = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    if (authContext) {
      await authContext.logout();
      navigate('/login');
    }
  };

  const goToLogin = () => navigate('/login');
  const goToRegister = () => navigate('/register');


  const isAuthenticated = authContext?.user;
  const isLoginPage = location.pathname === '/login';
  const isRegisterPage = location.pathname === '/register';
  const isDashboard = location.pathname === '/dashboard';

  return (
    <header className="global-header">
      <img className="logo" src={Logo1} alt="Logo" />
      <div className="header-center">
            {isAuthenticated && isDashboard && (
          <h2>
            Welcome to your Cave!
          </h2>
        )}
        </div>

      <nav className="global-header-nav">

        
    

       
              {isAuthenticated && (
        <>
          <button 
      className="userIcon"
      onClick={() => setIsProfileOpen(true)}
      title="Profile"
    >
      <User size={20} strokeWidth={2.2} />
    </button>

          <button className="headerButton logoutBtn" onClick={handleLogout}>
            Logout
          </button>
        <ProfileModal
      isOpen={isProfileOpen}
      onClose={() => setIsProfileOpen(false)}
    />
        </>

      )}


        
        {!isAuthenticated && isLoginPage && (
          <button className="headerButton" onClick={goToRegister}>
            Sign Up
          </button>
        )}

       
        {!isAuthenticated && isRegisterPage && (
          <button className="headerButton" onClick={goToLogin}>
            Login
          </button>
        )}
        
        
      </nav>
    </header>
  );
};

export default Header;