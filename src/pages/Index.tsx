import Sidebar from "@/components/Sidebar";
import MainContent from "@/components/MainContent";
import { useState } from "react";

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <MainContent onMenuOpen={() => setSidebarOpen(true)} />
    </div>
  );
};

export default Index;
