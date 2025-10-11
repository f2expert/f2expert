import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '../../../lib/utils';
import { useAuth } from '../../../hooks/useAuth';

export interface MenuItem {
  to: string;
  label: string;
  external?: boolean;
  onClick?: () => void;
}

export interface NavigationProps {
  menuItems?: MenuItem[];
  className?: string;
  mobileClassName?: string;
  itemClassName?: string;
  activeItemClassName?: string;
  brand?: React.ReactNode;
}



export const Navigation: React.FC<NavigationProps> = ({
  menuItems,
  className = '',
  mobileClassName = '',
  itemClassName = '',
  activeItemClassName = '',
  brand
}) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  // Handle logout with proper navigation
  const handleLogout = () => {
    try {
      logout();
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
      // Still navigate home even if logout fails
      navigate('/', { replace: true });
    }
  };

  // Generate dynamic menu items based on authentication status
  const getDynamicMenuItems = (): MenuItem[] => {
    const baseItems: MenuItem[] = [
      { to: "/", label: "Home" },
      { to: "/about", label: "About Us" },
      { to: "/contact", label: "Contact Us" },
      { to: "/courses", label: "Courses" },
      { to: "/tutorials", label: "Tutorials" },
    ];

    if (isAuthenticated) {
      // When authenticated: show Dashboard and Logout
      return [
        ...baseItems,
        { to: "/dashboard", label: "Dashboard" },
        { 
          to: "#", 
          label: "Logout", 
          onClick: handleLogout
        },
      ];
    } else {
      // When not authenticated: show Login
      return [
        ...baseItems,
        { to: "/login", label: "Login" },
      ];
    }
  };

  // Use provided menuItems or generate dynamic ones
  const finalMenuItems = menuItems || getDynamicMenuItems();

  return (
    <header className={cn(
      'mx-auto flex items-center justify-between pl-5',
      className
    )}>
      {/* Brand/Logo */}
      <div className="flex items-center gap-3">
        {brand}
        <div className="text-black text-sm">
          F2Expert 
          <br />
          <span className='text-xs text-gray-500'>Training Center</span>
        </div>
      </div>

      <div className="md:pr-0 px-4">
        {/* Hamburger Icon - shown only on mobile */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-sm text-white focus:outline-none md:hidden"
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          <i className={`fa-solid ${isOpen ? "fa-xmark" : "fa-bars"}`}></i>
        </button>

        {/* Responsive Menu */}
        <nav className={cn(
          'md:block',
          isOpen ? 'py-3 rounded shadow' : 'hidden',
          mobileClassName
        )}>
          <ul className={cn(
            'flex gap-3 text-sm text-white md:pr-4',
            isOpen && 'flex-col absolute right-2 w-52 bg-[#012f5c] p-2 rounded shadow-lg'
          )}>
            {finalMenuItems.map((item) => (
              <li
                key={item.to}
                className={cn(
                  'px-5 md:py-5 hover:bg-[#012a52] transition',
                  pathname === item.to && !isOpen ? 'bg-[#012a52] text-white' : 'text-gray-500',
                  itemClassName,
                  pathname === item.to ? activeItemClassName : ''
                )}
              >
                {item.external ? (
                  <a
                    href={item.to}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block py-2"
                  >
                    {item.label}
                  </a>
                ) : item.onClick ? (
                  <button
                    onClick={() => {
                      item.onClick?.();
                      setIsOpen(false);
                    }}
                    className="block py-2 w-full text-left hover:text-white"
                  >
                    {item.label}
                  </button>
                ) : (
                  <Link
                    to={item.to}
                    className="block py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navigation;