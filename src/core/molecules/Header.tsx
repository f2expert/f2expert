import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About Us" },
    { to: "/contact", label: "Contact Us" },
    { to: "/courses", label: "Courses" },
    { to: "/tutorials", label: "Tutorials" },
    { to: "/dashboard", label: "Dashboard" },
  ];

  return (
      <header className="mx-auto flex items-center justify-between relative pl-5  bg-[#012f5c]">
        {/* Logo */}
        <img src="assets/f2expert.jpg" alt="F2Expert" className="w-8 h-auto" />
        <div className="md:pr-0 px-4">
          {/* Hamburger Icon - shown only on sm */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-sm text-gray-700 focus:outline-none md:hidden"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            <i className={`fa-solid ${isOpen ? "fa-xmark" : "fa-bars"}`}></i>
          </button>

          {/* Responsive Menu */}
          <nav className={`md:block ${ isOpen ? "py-3 rounded shadow" : "hidden" }`}>
            <ul className={`flex gap-3 text-sm text-white md:pr-4 ${ isOpen && "flex-col absolute right-2 w-52" }`}>
              {menuItems.map((item) => (
                <li key={item.to} className={`px-3 md:py-8 rounded-sm hover:bg-[#012a52] transition ${
                      pathname === item.to && !isOpen ? "bg-[#012a52] text-white" : ""
                    }`}>
                  <Link to={item.to}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>
  );
}
