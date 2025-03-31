"use client"
import { NavLink, useNavigate } from "react-router-dom"
import { HomeIcon, UsersIcon, ShoppingBagIcon, ChartBarIcon, CogIcon, LogoutIcon } from "@heroicons/react/outline"
import logo from "../../assets/logo.png"

const Sidebar = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
    // Supprimer le token d'authentification
    localStorage.removeItem("adminToken")

    // Rediriger vers la page de connexion
    navigate("/login")
  }

  return (
    <div className="h-screen flex flex-col w-64 bg-gray-800 text-white">
      <div className="flex items-center justify-center h-16 border-b border-gray-700">
        <img src={logo || "/placeholder.svg"} alt="le mauvais sommet" className="h-8 w-auto" />
        <span className="ml-2 text-xl font-semibold">Le mauvais sommet</span>
      </div>

      <div className="flex-grow overflow-y-auto">
        <nav className="mt-5 px-2">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center px-4 py-2 mt-2 text-sm rounded-lg ${
                isActive ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`
            }
          >
            <HomeIcon className="h-5 w-5 mr-2" />
            Tableau de bord
          </NavLink>

          <NavLink
            to="/users"
            className={({ isActive }) =>
              `flex items-center px-4 py-2 mt-2 text-sm rounded-lg ${
                isActive ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`
            }
          >
            <UsersIcon className="h-5 w-5 mr-2" />
            Utilisateurs
          </NavLink>

          <NavLink
            to="/products"
            className={({ isActive }) =>
              `flex items-center px-4 py-2 mt-2 text-sm rounded-lg ${
                isActive ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`
            }
          >
            <ShoppingBagIcon className="h-5 w-5 mr-2" />
            Produits
          </NavLink>

          <NavLink
            to="/statistics"
            className={({ isActive }) =>
              `flex items-center px-4 py-2 mt-2 text-sm rounded-lg ${
                isActive ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`
            }
          >
            <ChartBarIcon className="h-5 w-5 mr-2" />
            Statistiques
          </NavLink>

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center px-4 py-2 mt-2 text-sm rounded-lg ${
                isActive ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`
            }
          >
            <CogIcon className="h-5 w-5 mr-2" />
            Paramètres
          </NavLink>
        </nav>
      </div>

      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-2 text-sm text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white"
        >
          <LogoutIcon className="h-5 w-5 mr-2" />
          Déconnexion
        </button>
      </div>
    </div>
  )
}

export default Sidebar

