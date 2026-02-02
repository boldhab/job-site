import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import FloatingChatbot from '../common/FloatingChatbot';

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-amber-50/10 to-white">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-80 transform transition-transform duration-300 ease-in-out lg:hidden ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <Sidebar />
      </div>

      {/* Header */}
      <div className="lg:ml-80">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      </div>
      
      {/* Main Content Area */}
      <div className="lg:ml-80 pt-20 min-h-screen">
        <main className="h-full">
          <div className="container-custom py-8">
            {children}
          </div>
        </main>
      </div>

      {/* Fixed Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* AI Assistant */}
      <FloatingChatbot />
    </div>
  );
};

export default DashboardLayout;