import React from 'react';
import { CompanyInfo } from '../../molecules/CompanyInfo';
import { FooterNavigation } from '../../molecules/FooterNavigation';
import { QuickConnect } from '../../molecules/QuickConnect';
import { SocialBar } from '../../molecules/SocialBar';
import { cn } from '../../../lib/utils';

interface FooterProps {
  className?: string;
  showCompanyInfo?: boolean;
  showNavigation?: boolean;
  showQuickConnect?: boolean;
  showTrainingCenter?: boolean;
  showSocial?: boolean;
  showCopyright?: boolean;
  companyName?: string;
  copyrightYear?: number;
  navigationSections?: Array<{
    title: string;
    links: Array<{
      label: string;
      href: string;
      external?: boolean;
    }>;
  }>;
  socialLinks?: Array<{
    href: string;
    icon: string;
    label: string;
  }>;
  contactEmail?: string;
  contactPhone?: string;
}

export const Footer: React.FC<FooterProps> = ({
  className,
  showCompanyInfo = true,
  showNavigation = true,
  showQuickConnect = true,
  showTrainingCenter = true,
  showSocial = true,
  showCopyright = true,
  companyName = "F2Export",
  copyrightYear = new Date().getFullYear(),
  navigationSections = [
    {
      title: "Company",
      links: [
        { label: "About Us", to: "/about" },
        { label: "Courses", to: "/courses" },
        { label: "Tutorial", to: "/tutorial" },
        { label: "Contact", to: "/contact" }
      ]
    }
  ],
  socialLinks = [
    { href: "https://facebook.com", icon: "fa-facebook-f", label: "Facebook" },
    { href: "https://twitter.com", icon: "fa-twitter", label: "Twitter" },
    { href: "https://linkedin.com", icon: "fa-linkedin-in", label: "LinkedIn" },
    { href: "https://instagram.com", icon: "fa-instagram", label: "Instagram" }
  ],
  contactEmail = "info@f2export.com",
  contactPhone = "+1 (555) 123-4567",
  ...props
}) => {
  // Note: showTrainingCenter prop is reserved for future training center section
  // Currently not implemented but accepted to avoid prop warnings
  void showTrainingCenter;
  
  return (
    <footer className={cn("w-full bg-[#012a52] text-white", className)} {...props}>
      {/* Main Footer Content 
      <div className={cn("px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16")}>
        <div className="max-w-7xl mx-auto">*/}
          {/* Responsive Grid Layout with Wider Company Section 
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
            */}

            {/* Company Info Section - Wider Second Column 
            {showCompanyInfo && (
              <div className="md:col-span-2 lg:col-span-2 space-y-6">
                <CompanyInfo
                  description="123 Business District, Export City, EC 12345"
                  email={contactEmail}
                  phone={contactPhone}
                />
              </div>
            )}*/}
{/* Navigation Section - First Column 
            {showNavigation && (
              <div className="space-y-6">
                {navigationSections.map((section, index) => (
                  <FooterNavigation
                    key={index}
                    title={section.title}
                    navItems={section.links}
                  />
                ))}
              </div>
            )}*/}
            {/* Quick Connect Section - Third Column 
            {showQuickConnect && (
              <div className="space-y-6">
                <QuickConnect
                  title="Quick Connect"
                />
              </div>
            )}
          </div>
        </div>
      </div>*/}

      {/* Footer Bottom */}
      {(showCopyright || showSocial) && (
        <div className="border-t border-gray-800">
          <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
              {showCopyright && (
                <div className="text-xs sm:text-sm text-center sm:text-left">
                  <p>
                    © {copyrightYear} {companyName}. All rights reserved.
                  </p>
                  <p className="mt-1 space-x-2 sm:space-x-4">
                    <a 
                      href="/privacy" 
                      className="hover:text-white transition-colors"
                    >
                      Privacy Policy
                    </a>
                    <span className="text-gray-600">•</span>
                    <a 
                      href="/terms" 
                      className="hover:text-white transition-colors"
                    >
                      Terms of Service
                    </a>
                  </p>
                </div>
              )}

              {showSocial && (
                <SocialBar
                  socialLinks={socialLinks}
                  className="flex space-x-3 sm:space-x-4 text-white"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;