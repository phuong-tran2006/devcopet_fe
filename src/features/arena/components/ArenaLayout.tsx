import React from "react";
import ArenaSidebar from "./ArenaSidebar";

interface ArenaLayoutProps {
  children: React.ReactNode;
}

const ArenaLayout: React.FC<ArenaLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-[calc(100vh-80px)] dark:bg-[#081015] bg-surface dark:text-white text-on-surface overflow-hidden transition-colors duration-300">
      <ArenaSidebar />
      <div className="flex-1 h-full overflow-y-auto bg-surface-container-lowest/50">
        {children}
      </div>
    </div>
  );
};

export default ArenaLayout;
