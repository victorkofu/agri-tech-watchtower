
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Droplet, Leaf, Bird, User } from 'lucide-react';

const Sidebar = ({ isOpen }) => {
  const menuItems = [
    {
      path: '/dashboard',
      name: 'Dashboard',
      icon: <Home size={20} />
    },
    {
      path: '/aquaponics',
      name: 'Aquaponics',
      icon: <Droplet size={20} />
    },
    {
      path: '/hydroponics',
      name: 'Hydroponics',
      icon: <Leaf size={20} />
    },
    {
      path: '/poultry',
      name: 'Poultry',
      icon: <Bird size={20} />
    },
    {
      path: '/profile',
      name: 'Profile',
      icon: <User size={20} />
    }
  ];

  return (
    <aside 
      className={`fixed left-0 top-0 z-40 h-screen pt-16 transition-transform bg-white border-r border-gray-200 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 w-64`}
    >
      <div className="h-full px-3 pb-4 overflow-y-auto">
        <ul className="space-y-2 mt-4">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => 
                  `flex items-center p-3 rounded-lg ${
                    isActive 
                      ? 'bg-primary text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                {item.icon}
                <span className="ml-3 font-medium">{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
        
        <div className="mt-8 pt-4 border-t border-gray-200">
          <div className="px-3 py-2 rounded-lg bg-muted">
            <h4 className="text-sm font-medium text-gray-600">Status</h4>
            <div className="mt-2 flex items-center">
              <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
              <span className="text-sm text-gray-600">All systems online</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
