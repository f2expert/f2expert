import React from 'react';
import { Public } from '../components/templates/Public';
import { type SocialMediaItem } from '../components/molecules/SocialBar';
import { type ContactItem } from '../components/molecules/ContactInfo';
import { type MenuItem } from '../components/molecules/Navigation';

// Example usage of Public template with integrated Header component
export const PublicTemplateExample: React.FC = () => {
  // Custom social media links
  const customSocialLinks: SocialMediaItem[] = [
    { href: "https://facebook.com/f2expert", icon: "fa-facebook-f", label: "Facebook" },
    { href: "https://twitter.com/f2expert", icon: "fa-twitter", label: "Twitter" },
    { href: "https://instagram.com/f2expert", icon: "fa-instagram", label: "Instagram" },
    { href: "https://github.com/f2expert", icon: "fa-github-alt", label: "GitHub" },
    { href: "https://linkedin.com/company/f2expert", icon: "fa-linkedin-in", label: "LinkedIn" },
  ];

  // Custom contact information
  const customContactInfo: ContactItem[] = [
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

  // Custom menu items for public pages
  const publicMenuItems: MenuItem[] = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About Us" },
    { to: "/contact", label: "Contact Us" },
    { to: "/courses", label: "Courses" },
    { to: "/tutorials", label: "Tutorials" },
    { to: "/login", label: "Login" },
  ];

  return (
    <div>
      {/* Example 1: Full Public template with custom header */}
      <Public
        socialLinks={customSocialLinks}
        contactItems={customContactInfo}
        menuItems={publicMenuItems}
        logoSrc="assets/f2expert.jpg"
        logoText="F2Expert"
        showTopBar={true}
        showSocial={true}
        showContact={true}
      >
        <div className="max-w-5xl mx-auto p-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Welcome to F2Expert
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Your ultimate destination for learning and expertise.
          </p>
        </div>
      </Public>

      {/* Example 2: Public template without top bar */}
      <Public
        menuItems={publicMenuItems}
        logoText="F2Expert"
        showTopBar={false}
      >
        <div className="max-w-5xl mx-auto p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Clean Header Design
          </h2>
          <p className="text-gray-600">
            This template shows the header without the top social/contact bar.
          </p>
        </div>
      </Public>

      {/* Example 3: Minimal public template */}
      <Public
        logoText="Brand"
        showContact={false}
        showSocial={false}
      >
        <div className="max-w-5xl mx-auto p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Minimal Design
          </h2>
          <p className="text-gray-600">
            This template shows a minimal header with just logo and navigation.
          </p>
        </div>
      </Public>
    </div>
  );
};

export default PublicTemplateExample;