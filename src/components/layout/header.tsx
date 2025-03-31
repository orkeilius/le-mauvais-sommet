"use client"
import { MenuIcon, BellIcon } from "@heroicons/react/outline"

interface HeaderProps {
  toggleSidebar: () => void
}

const Header = ({ toggleSidebar }: HeaderProps) => {
  return (
    <header className="bg-white shadow-sm h-16 flex items-center justify-between px-4 md:px-6">
      <button onClick={toggleSidebar} className="text-gray-500 focus:outline-none md:hidden">
        <MenuIcon className="h-6 w-6" />
      </button>

      <div className="flex-1 flex justify-center md:justify-start">
        <h1 className="text-xl font-semibold text-gray-800 md:ml-2">Administration Le mauvais sommet</h1>
      </div>

      <div className="flex items-center">
        <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none">
          <span className="sr-only">Voir les notifications</span>
          <BellIcon className="h-6 w-6" />
        </button>

        <div className="ml-3 relative">
          <div className="flex items-center">
            <img
              className="h-8 w-8 rounded-full"
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="Admin"
            />
            <span className="ml-2 text-sm font-medium text-gray-700 hidden md:block">Admin</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header

