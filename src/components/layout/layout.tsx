"use client"

import { useState } from "react"
import { Outlet } from "react-router-dom"
import Sidebar from "./sidebar"
import Header from "./header"

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar pour mobile (avec overlay) */}
      <div className={`md:hidden ${sidebarOpen ? "block" : "hidden"} fixed inset-0 z-40`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={toggleSidebar}></div>
        <div className="fixed inset-y-0 left-0 flex flex-col z-40 max-w-xs w-full bg-gray-800 transform transition-transform duration-300 ease-in-out">
          <Sidebar />
        </div>
      </div>

      {/* Sidebar pour desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <Sidebar />
      </div>

      {/* Contenu principal */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout

