import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { Toaster } from "@/components/ui/sonner";

export function MainLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar 
        isCollapsed={isCollapsed} 
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)} 
      />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
}