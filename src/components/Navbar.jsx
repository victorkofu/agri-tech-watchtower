
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bell, Settings, LogOut, Menu } from 'lucide-react';

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-2.5 fixed w-full z-50">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <button 
            onClick={toggleSidebar}
            className="p-2 rounded-md hover:bg-gray-100 focus:outline-none md:hidden"
          >
            <Menu size={24} />
          </button>
          <Link to="/dashboard" className="flex items-center ml-2 md:ml-0">
            <img 
              src="https://agrisiti.com/wp-content/uploads/2022/05/Agrisiti-Logo-on-black-1-cropped.svg" 
              alt="Agrisiti Logo" 
              className="h-8 w-auto"
            />
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full hover:bg-gray-100 relative">
            <Bell size={20} />
            <span className="absolute top-1 right-1 bg-red-500 rounded-full w-2 h-2"></span>
          </button>
          
          <Link to="/profile" className="p-2 rounded-full hover:bg-gray-100">
            <Settings size={20} />
          </Link>
          
          <div className="flex items-center">
            <img 
              src={user?.profileImage || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=2E7D32&color=fff`}
              alt="Profile" 
              className="h-8 w-8 rounded-full mr-2"
            />
            <div className="hidden md:block">
              <p className="text-sm font-medium">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-500">{user?.role || 'User'}</p>
            </div>
          </div>
          
          <button 
            onClick={logout}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
