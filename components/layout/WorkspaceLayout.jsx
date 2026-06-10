import { useState } from 'react';
import React from 'react'
import Sidebar from './Sidebar'
import { Menu, X } from 'lucide-react'

export default function WorkspaceLayout({ children, activeItem }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-white">
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-0 left-0 z-40 p-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-gray-100 transition-colors"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar - Hidden on mobile, visible on md+ */}
      <div className={`fixed md:static top-0 left-0 h-screen overflow-y-auto transition-transform transform md:transform-none ${
        sidebarOpen ? 'translate-x-0 z-30' : '-translate-x-full md:translate-x-0'
      }`}>
        <Sidebar activeItem={activeItem} onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-20"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-y-auto min-w-0 pt-16 md:pt-0">
        {children}
      </main>
    </div>
  )
}
