import { LucideIcon } from "lucide-react";

export interface LoadingSpinnerProps {
  icon: LucideIcon;
  color?: string;
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

const LoadingSpinner = ({
  icon: Icon,
  color = "blue",
  size = "md",
  text = "Loading...",
  className = ""
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16"
  };

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8"
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-4 py-12 ${className}`}>
      <div className={`relative ${sizeClasses[size]}`}>
        <div className={`absolute inset-0 animate-ping rounded-full bg-${color}-400 opacity-25`}></div>
        <div className={`relative flex ${sizeClasses[size]} items-center justify-center rounded-full bg-gradient-to-r from-${color}-500 to-${color}-400`}>
          <Icon className={`${iconSizes[size]} text-white`} />
        </div>
      </div>
      {text && (
        <p className="text-slate-600 dark:text-slate-400">
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;