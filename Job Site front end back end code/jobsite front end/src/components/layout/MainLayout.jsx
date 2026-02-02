import React from 'react';
import Header from './Header';
import Footer from './Footer';
import FloatingChatbot from '../common/FloatingChatbot';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-amber-50/10 to-white">
      {/* Decorative top accent line */}
      <div className="h-1 bg-gradient-to-r from-amber-300/50 via-amber-400 to-amber-300/50"></div>
      
      <Header />
      
      <main className="flex-grow w-full">
        <div className="relative">
          {/* Optional background pattern - uncomment if needed */}
          {/* <div className="absolute inset-0 bg-grid-amber-200/10 [mask-image:radial-gradient(ellipse_at_top,white,transparent)]"></div> */}
          
          {/* Main content wrapper */}
          <div className="relative">
            {children}
          </div>
        </div>
      </main>
      
      <Footer />
      
      {/* AI Assistant */}
      <FloatingChatbot />
      
      {/* Optional bottom gradient accent */}
      <div className="h-2 bg-gradient-to-r from-transparent via-amber-200/30 to-transparent mt-auto"></div>
    </div>
  );
};

export default MainLayout;