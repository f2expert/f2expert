import React from 'react';
import { SocialIcon } from '../../atoms/SocialIcon';
import { cn } from '../../../lib/utils';

export interface SocialMediaItem {
  href: string;
  icon: string;
  label: string;
}

export interface SocialBarProps {
  socialLinks?: SocialMediaItem[];
  className?: string;
  alignment?: 'left' | 'center' | 'right';
}

const defaultSocialLinks: SocialMediaItem[] = [
  { href: "#", icon: "fa-facebook-f", label: "Facebook" },
  { href: "#", icon: "fa-twitter", label: "Twitter" },
  { href: "#", icon: "fa-instagram", label: "Instagram" },
  { href: "#", icon: "fa-github-alt", label: "GitHub" },
  { href: "#", icon: "fa-linkedin-in", label: "LinkedIn" },
];

export const SocialBar: React.FC<SocialBarProps> = ({
  socialLinks = defaultSocialLinks,
  className = '',
  alignment = 'center'
}) => {
  const alignmentClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end'
  };

  return (
    <div className={cn(
      'flex gap-2',
      alignmentClasses[alignment],
      className
    )}>
      {socialLinks.map((social, index) => (
        <SocialIcon
          key={index}
          href={social.href}
          icon={social.icon}
          label={social.label}
        />
      ))}
    </div>
  );
};

export default SocialBar;