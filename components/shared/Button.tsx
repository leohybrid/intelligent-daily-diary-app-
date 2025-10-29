import React, { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  title?: string;
}

const Button: React.FC<ButtonProps> = ({ children, onClick, variant = 'primary', className = '', disabled = false, type = 'button', title }) => {
  const baseClasses = 'px-4 py-2 rounded-lg font-semibold transition-all duration-200 ease-in-out flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-ring',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:ring-ring',
    ghost: 'bg-transparent text-primary hover:bg-accent',
  };

  return (
    <button 
        type={type} 
        onClick={onClick} 
        className={`${baseClasses} ${variantClasses[variant]} ${className}`} 
        disabled={disabled}
        title={title}
    >
      {children}
    </button>
  );
};

export default Button;
