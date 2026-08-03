import React from 'react';
import { Button } from '@/components/ui/button';
import { Phone, MessageCircle, Headphones } from 'lucide-react';

const SupportButton = ({ 
  variant = 'primary', 
  size = 'default', 
  onClick,
  href,
  children = "Get Support",
  className = "",
  icon = "headphones"
}) => {
  const getIcon = () => {
    switch (icon) {
      case 'phone':
        return <Phone className="w-4 h-4" />;
      case 'message':
        return <MessageCircle className="w-4 h-4" />;
      default:
        return <Headphones className="w-4 h-4" />;
    }
  };

  const getStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg hover:shadow-xl';
      case 'secondary':
        return 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl';
      case 'outline':
        return 'border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-600';
      case 'ghost':
        return 'text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700';
      default:
        return 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg hover:shadow-xl';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-4 py-2 text-sm';
      case 'lg':
        return 'px-8 py-4 text-lg';
      case 'xl':
        return 'px-10 py-5 text-xl';
      default:
        return 'px-6 py-3';
    }
  };

  const baseClasses = `font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 ${getStyles()} ${getSizeClasses()} ${className}`;

  if (href) {
    return (
      <a 
        href={href} 
        className={baseClasses}
        onClick={onClick}
      >
        <span className="flex items-center gap-2">
          {getIcon()}
          {children}
        </span>
      </a>
    );
  }

  return (
    <Button 
      className={baseClasses}
      onClick={onClick}
    >
      <span className="flex items-center gap-2">
        {getIcon()}
        {children}
      </span>
    </Button>
  );
};

export default SupportButton;
