import React from 'react'
import Sidebar from './Sidebar'

export default function WorkspaceLayout({ children, activeItem }) {
  return (
    <div className="flex h-screen bg-white">
      <div className="sticky top-0 h-screen overflow-y-auto">
        <Sidebar activeItem={activeItem} />
      </div>
      <main className="flex-1 flex flex-col overflow-y-auto min-w-0">
        {children}
      </main>
    </div>
  )
}
