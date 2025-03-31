"use client"

import { useState, useEffect } from "react"
import { ChartPieIcon, CurrencyDollarIcon, ShoppingCartIcon, UserGroupIcon } from "@heroicons/react/outline"
import { Line, Pie } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"

// Enregistrer les composants Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend)

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalSales: 0,
    totalRevenue: 0,
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Charger les statistiques
    const loadStats = async () => {
      try {
        // Intégration avec le backend existant
        // Exemple: const response = await api.getStats();

        // Pour la démo, on simule des données
        setTimeout(() => {
          setStats({
            totalUsers: 1245,
            totalProducts: 876,
            totalSales: 432,
            totalRevenue: 15680,
          })
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Erreur lors du chargement des statistiques:", error)
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  // Données pour le graphique des ventes
  const salesData = {
    labels: ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"],
    datasets: [
      {
        label: "Ventes 2023",
        data: [30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195],
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        tension: 0.3,
      },
      {
        label: "Ventes 2022",
        data: [25, 35, 50, 65, 80, 95, 110, 125, 140, 155, 170, 185],
        borderColor: "rgb(153, 102, 255)",
        backgroundColor: "rgba(153, 102, 255, 0.5)",
        tension: 0.3,
      },
    ],
  }

  // Options pour le graphique des ventes
  const salesOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Évolution des ventes",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  }

  // Données pour le graphique des catégories
  const categoryData = {
    labels: ["PDF", "Images", "Templates", "Vidéos", "Audio", "Autres"],
    datasets: [
      {
        label: "Produits par catégorie",
        data: [300, 250, 150, 100, 50, 25],
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
          "rgba(153, 102, 255, 0.5)",
          "rgba(255, 159, 64, 0.5)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  }

  // Options pour le graphique des catégories
  const categoryOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "right" as const,
      },
      title: {
        display: true,
        text: "Répartition par catégorie",
      },
    },
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Tableau de bord</h2>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <>
          {/* Cartes de statistiques */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-indigo-100 rounded-full p-3">
                  <UserGroupIcon className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="ml-5">
                  <p className="text-gray-500 text-sm">Utilisateurs</p>
                  <h3 className="text-xl font-semibold text-gray-800">{stats.totalUsers}</h3>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 rounded-full p-3">
                  <ShoppingCartIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5">
                  <p className="text-gray-500 text-sm">Produits</p>
                  <h3 className="text-xl font-semibold text-gray-800">{stats.totalProducts}</h3>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-100 rounded-full p-3">
                  <ChartPieIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-5">
                  <p className="text-gray-500 text-sm">Ventes</p>
                  <h3 className="text-xl font-semibold text-gray-800">{stats.totalSales}</h3>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-100 rounded-full p-3">
                  <CurrencyDollarIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-5">
                  <p className="text-gray-500 text-sm">Revenus</p>
                  <h3 className="text-xl font-semibold text-gray-800">{stats.totalRevenue} €</h3>
                </div>
              </div>
            </div>
          </div>

          {/* Graphiques */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-5">
              <Line data={salesData} options={salesOptions} />
            </div>

            <div className="bg-white rounded-lg shadow p-5">
              <Pie data={categoryData} options={categoryOptions} />
            </div>
          </div>

          {/* Dernières activités */}
          <div className="mt-8 bg-white rounded-lg shadow">
            <div className="px-5 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Dernières activités</h3>
            </div>
            <div className="p-5">
              <ul className="divide-y divide-gray-200">
                <li className="py-3">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-green-100 rounded-full p-2">
                      <ShoppingCartIcon className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-gray-800">
                        <span className="font-medium">Thomas Dubois</span> a vendu{" "}
                        <span className="font-medium">Template site e-commerce</span>
                      </p>
                      <p className="text-xs text-gray-500">Il y a 2 heures</p>
                    </div>
                  </div>
                </li>
                <li className="py-3">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-blue-100 rounded-full p-2">
                      <UserGroupIcon className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-gray-800">
                        <span className="font-medium">Marie Lefèvre</span> s'est inscrite
                      </p>
                      <p className="text-xs text-gray-500">Il y a 3 heures</p>
                    </div>
                  </div>
                </li>
                <li className="py-3">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-indigo-100 rounded-full p-2">
                      <ShoppingCartIcon className="h-4 w-4 text-indigo-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-gray-800">
                        <span className="font-medium">Pierre Martin</span> a ajouté{" "}
                        <span className="font-medium">Pack d'icônes premium</span>
                      </p>
                      <p className="text-xs text-gray-500">Il y a 5 heures</p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Dashboard

