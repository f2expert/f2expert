import React from 'react';
import { Header } from '../components/organisms/Header';

// Example usage of the new Header component system
export const HeaderExample: React.FC = () => {
  // Custom social media links
  const customSocialLinks = [
    { href: "https://facebook.com/f2expert", icon: "fa-facebook-f", label: "Facebook" },
    { href: "https://twitter.com/f2expert", icon: "fa-twitter", label: "Twitter" },
    { href: "https://instagram.com/f2expert", icon: "fa-instagram", label: "Instagram" },
    { href: "https://github.com/f2expert", icon: "fa-github-alt", label: "GitHub" },
    { href: "https://linkedin.com/company/f2expert", icon: "fa-linkedin-in", label: "LinkedIn" },
  ];

  // Custom contact information
  const customContactInfo = [
    { 
      href: "tel:+919990012545", 
      label: "Phone", 
      icon: "fa-phone",
      value: "CALL: +91 9990012545" 
    },
    { 
      href: "mailto:info@f2expert.com", 
      label: "Email", 
      icon: "fa-envelope",
      value: "EMAIL: info@f2expert.com" 
    },
  ];

  // Custom menu items
  const customMenuItems = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About Us" },
    { to: "/contact", label: "Contact Us" },
    { to: "/courses", label: "Courses" },
    { to: "/tutorials", label: "Tutorials" },
    { to: "/dashboard", label: "Dashboard" },
  ];

  return (
    <div>
      {/* Example 1: Full Header with all features */}
      <Header
        socialLinks={customSocialLinks}
        contactItems={customContactInfo}
        menuItems={customMenuItems}
        logoSrc="assets/f2expert.jpg"
        logoText="F2Expert"
        logoTo="/"
        logoSize="sm"
        showTopBar={true}
        showSocial={true}
        showContact={true}
      />

      {/* Example 2: Header without top bar */}
      <Header
        menuItems={customMenuItems}
        logoText="F2Expert"
        showTopBar={false}
      />

      {/* Example 3: Header with custom styling */}
      <Header
        menuItems={customMenuItems}
        logoText="F2Expert"
        className="shadow-lg"
        topBarClassName="bg-gray-100"
        mainHeaderClassName="bg-blue-900"
      />
    </div>
  );
};

export default HeaderExample;