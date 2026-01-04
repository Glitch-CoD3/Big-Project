import React, { useState } from "react";
import { Header } from "../../Components/Header.jsx";
import { Sidebar } from "../../Components/Sidebar.jsx";
import { ContentPage } from "../../Components/ContentPage.jsx";
import { ToastContainer } from "react-toastify";

function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <div className="min-h-screen bg-gray-900 text-white relative">
        {/* Header (Always Fixed) */}
        <Header
          className="fixed top-0 left-0 w-full z-30"
          onToggleSidebar={() => setSidebarOpen(true)}
        />

        {/* MINI SIDEBAR (DESKTOP ONLY) */}
        <div className="hidden md:block fixed top-14 left-0 w-20 h-[calc(100vh-3.5rem)] bg-gray-900 border-r z-20">
          <Sidebar mode="mini" />
        </div>

        {/* FULL SIDEBAR (OVERLAY – on top of everything) */}
        <Sidebar
          mode="full"
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* OVERLAY */}
        <div
          className={`fixed inset-0 bg-black/50 transition-opacity duration-300 ease-in-out
            ${sidebarOpen ? "opacity-100 pointer-events-auto z-40" : "opacity-0 pointer-events-none"}`}
          onClick={() => setSidebarOpen(false)}
        />

        {/* CONTENT */}
        <main className="pt-4 md:ml-20 transition-all duration-300 ease-in-out">
          <ContentPage />
        </main>
      </div>

      <ToastContainer />
    </>
  );
}

export default Home;
