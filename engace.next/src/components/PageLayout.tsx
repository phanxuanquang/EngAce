import { ReactNode } from "react";
import Navbar from "@/components/Navbar";

export interface PageLayoutProps {
  children: ReactNode;
  gradient?: string;
  className?: string;
  bgEffects?: boolean;
}

const PageLayout = ({ 
  children, 
  gradient = "from-blue-400 via-purple-400 to-blue-600",
  className = "",
  bgEffects = true 
}: PageLayoutProps) => {
  return (
    <div className={`min-h-screen relative flex items-center justify-center overflow-hidden ${
      gradient ? `bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] ${gradient}` : ""
    } ${className}`}>
      {bgEffects && (
        <>
          <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-purple-400 blur-3xl opacity-30"></div>
          <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-blue-400 blur-3xl opacity-30"></div>
        </>
      )}
      <Navbar />
      {children}
    </div>
  );
};

export default PageLayout;