import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../../lib/utils';
import { 
  FaFacebookF, 
  FaTwitter, 
  FaInstagram, 
  FaGithubAlt, 
  FaLinkedinIn,
  FaYoutube,
  FaTiktok,
  FaWhatsapp,
  FaTelegram
} from 'react-icons/fa';

export interface SocialIconProps {
  href: string;
  icon: string;
  label?: string;
  className?: string;
}

// Icon mapping for FontAwesome class names to React Icons
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'fa-facebook-f': FaFacebookF,
  'fa-twitter': FaTwitter,
  'fa-instagram': FaInstagram,
  'fa-github-alt': FaGithubAlt,
  'fa-linkedin-in': FaLinkedinIn,
  'fa-youtube': FaYoutube,
  'fa-tiktok': FaTiktok,
  'fa-whatsapp': FaWhatsapp,
  'fa-telegram': FaTelegram,
};

export const SocialIcon: React.FC<SocialIconProps> = ({
  href,
  icon,
  label,
  className = ''
}) => {
  const IconComponent = iconMap[icon];
  
  if (!IconComponent) {
    console.warn(`Icon "${icon}" not found. Available icons:`, Object.keys(iconMap));
    return null;
  }

  return (
    <Link
      to={href}
      className={cn(
        'inline-flex items-center justify-center w-7 h-7 text-gray-400 hover:text-blue-900 transition-all duration-200 hover:scale-110',
        className
      )}
      aria-label={label}
    >
      <IconComponent className="text-md" />
    </Link>
  );
};

export default SocialIcon;