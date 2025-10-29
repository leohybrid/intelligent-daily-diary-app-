import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const Card: React.FC<CardProps> = ({ children, className = '', style }) => {
  return (
    <div 
      className={`bg-card/70 dark:bg-card/70 backdrop-blur-xl shadow-lg border border-border/60 rounded-xl p-6 ${className}`}
      style={style}
    >
      {children}
    </div>
  );
};

export default Card;
