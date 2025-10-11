import React from 'react';
import { Navigation, type MenuItem } from '../../molecules/Navigation';
import { Logo } from '../../atoms/Logo';
import { cn } from '../../../lib/utils';
import f2expertLogo from '../../../assets/f2expert.jpg';

export interface MainHeaderProps {
  logoSrc?: string;
  logoText?: string;
  logoHref?: string;
  logoTo?: string;
  menuItems?: MenuItem[];
  className?: string;
  navigationClassName?: string;
  logoSize?: 'sm' | 'md' | 'lg';
}

export const MainHeader: React.FC<MainHeaderProps> = ({
  logoSrc = f2expertLogo,
  logoText = "F2Expert",
  logoHref,
  logoTo = "/",
  menuItems,
  className = '',
  navigationClassName = '',
  logoSize = 'sm'
}) => {
  const brandElement = (
    <Logo
      src={logoSrc}
      text={logoText}
      alt={logoText}
      href={logoHref}
      to={logoTo}
      size={logoSize}
    />
  );

  return (
    <Navigation
      menuItems={menuItems}
      brand={brandElement}
      className={cn(
        'mx-auto flex items-center justify-between pl-5',
        className,
        navigationClassName
      )}
    />
  );
};

export default MainHeader;