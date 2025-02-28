import { ReactNode } from "react";

export interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
  transparent?: boolean;
}

const Card = ({
  children,
  className = "",
  onClick,
  hover = true,
  transparent = false
}: CardProps) => {
  const baseClasses = "rounded-2xl p-6 shadow-lg backdrop-blur-sm transition-all duration-300";
  const hoverClasses = hover ? "hover:shadow-xl" : "";
  const bgClasses = transparent 
    ? "bg-white/80 dark:bg-slate-800/80" 
    : "bg-white dark:bg-slate-800";
  const interactiveClasses = onClick ? "cursor-pointer" : "";

  return (
    <div
      className={`${baseClasses} ${hoverClasses} ${bgClasses} ${interactiveClasses} ${className}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
    >
      {children}
    </div>
  );
};

export default Card;