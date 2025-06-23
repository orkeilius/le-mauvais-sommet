"use client"

import { useState, useEffect } from "react"
import { PencilIcon, TrashIcon, SearchIcon, EyeIcon } from "@heroicons/react/outline"
import AuctionRepository from "../Repository/AuctionRepository"
import Auction from "../model/Auction"

// Types
interface Product {
  id: string
  title: string
  description: string
  price: number
  startingPrice: number
  currentBid: number
  bidsCount: number
  category: string
  status: "draft" | "active" | "sold" | "expired"
  seller: {
    id: string
    name: string
  }
  createdAt: string
  endDate: string
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [searchQuery, setSearchQuery] = useState("") // Server-side search
  const [currentPage, setCurrentPage] = useState(1)
  const [productsPerPage] = useState(10)
  const [filter, setFilter] = useState("all") // 'all', 'active', 'sold', 'expired', 'draft'
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [bulkLoading, setBulkLoading] = useState(false)
  const [categories] = useState(["Tous", "Enchères", "Électronique", "Mode", "Art", "Sport", "Livres", "Maison"])
  const [selectedCategory, setSelectedCategory] = useState("Tous")
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [productToEdit, setProductToEdit] = useState<Product | null>(null)

  useEffect(() => {
    loadProductsFromAPI(0, filter, searchQuery)
  }, [filter, searchQuery]) // Recharger quand le filtre ou la recherche change

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchQuery(searchTerm)
      setCurrentPage(1)
    }, 500) // 500ms debounce

    return () => clearTimeout(timeoutId)
  }, [searchTerm])

  // Advanced search with category and better filtering
  const filteredProducts = products.filter((product) => {
    const matchesSearch = searchQuery === "" || 
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.seller.name.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = selectedCategory === "Tous" || product.category === selectedCategory

    const matchesStatus = filter === "all" || product.status === filter

    return matchesSearch && matchesCategory && matchesStatus
  })

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)

  // Changer de page
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber)
    // Optionnel: recharger les données depuis l'API pour la nouvelle page
    // loadProductsFromAPI(pageNumber - 1, filter)
  }

  // Fonction utilitaire pour recharger les données
  const loadProductsFromAPI = async (page: number = 0, currentFilter: string = filter, search: string = "") => {
    try {
      setLoading(true)
      const auctionRepository = AuctionRepository.getInstance()
      
      // Mapper le filtre vers le format de l'API
      let apiFilter = ""
      if (currentFilter === "active") {
        apiFilter = "active"
      } else if (currentFilter === "sold") {
        apiFilter = "ended"
      } else if (currentFilter === "expired") {
        apiFilter = "expired"
      }
    
        let auctions = await auctionRepository.getAuctionList(page, apiFilter);
  
      
      const transformedProducts: Product[] = auctions.map((auction: Auction) => ({
        id: auction.id.toString(),
        title: auction.name,
        description: auction.description,
        price: auction.startingPrice,
        startingPrice: auction.startingPrice,
        currentBid: auction.highestOffer,
        bidsCount: auction.offersCount || 0,
        category: "Enchères", 
        status: auction.isEnded() ? "sold" : (auction.isEnding() ? "expired" : "active"),
        seller: {
          id: auction.author.id.toString(),
          name: auction.author.name,
        },
        createdAt: auction.createdAt.toISOString(),
        endDate: auction.endAt.toISOString(),
      }))

      setProducts(transformedProducts)
      setLoading(false)
    } catch (error) {
      console.error("Erreur lors du chargement des produits:", error)
      
      const mockProducts: Product[] = Array.from({ length: 30 }, (_, i) => ({
        id: `p${i + 1}`,
        title: `Produit ${i + 1}`,
        description: `Description du produit ${i + 1}`,
        price: Math.floor(Math.random() * 100) + 10,
        startingPrice: Math.floor(Math.random() * 50) + 5,
        currentBid: Math.floor(Math.random() * 150) + 10,
        bidsCount: Math.floor(Math.random() * 20),
        category: ["PDF", "Images", "Templates", "Vidéos", "Audio"][Math.floor(Math.random() * 5)],
        status: ["active", "sold", "expired", "draft"][Math.floor(Math.random() * 4)] as any,
        seller: {
          id: `s${Math.floor(Math.random() * 10) + 1}`,
          name: `Vendeur ${Math.floor(Math.random() * 10) + 1}`,
        },
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
        endDate: new Date(Date.now() + Math.floor(Math.random() * 10000000000)).toISOString(),
      }))

      setProducts(mockProducts)
      setLoading(false)
    }
  }









  // Formater la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("fr-FR", { year: "numeric", month: "short", day: "numeric" })
  }

  // Obtenir la classe de couleur en fonction du statut
  const getStatusColor = (status: Product["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "sold":
        return "bg-blue-100 text-blue-800"
      case "expired":
        return "bg-red-100 text-red-800"
      case "draft":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Obtenir le libellé du statut
  const getStatusLabel = (status: Product["status"]) => {
    switch (status) {
      case "active":
        return "En vente"
      case "sold":
        return "Vendu"
      case "expired":
        return "Expiré"
      case "draft":
        return "Brouillon"
      default:
        return status
    }
  }

  // Bulk operations
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(currentProducts.map(p => p.id))
    } else {
      setSelectedProducts([])
    }
  }

  const handleSelectProduct = (productId: string, checked: boolean) => {
    if (checked) {
      setSelectedProducts([...selectedProducts, productId])
    } else {
      setSelectedProducts(selectedProducts.filter(id => id !== productId))
    }
  }




  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Gestion des produits</h2>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-4 md:mb-0">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher un produit..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full md:w-80"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1) 
              }}
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value)
              setCurrentPage(1)
            }}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => {
            setFilter("all")
            setCurrentPage(1)
          }}
          className={`px-4 py-2 rounded-md ${
            filter === "all" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Tous
        </button>
        <button
          onClick={() => {
            setFilter("active")
            setCurrentPage(1)
          }}
          className={`px-4 py-2 rounded-md ${
            filter === "active" ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          En vente
        </button>
        <button
          onClick={() => {
            setFilter("sold")
            setCurrentPage(1)
          }}
          className={`px-4 py-2 rounded-md ${
            filter === "sold" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Vendus
        </button>
        <button
          onClick={() => {
            setFilter("expired")
            setCurrentPage(1)
          }}
          className={`px-4 py-2 rounded-md ${
            filter === "expired" ? "bg-red-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Expirés
        </button>
        <button
          onClick={() => {
            setFilter("draft")
            setCurrentPage(1)
          }}
          className={`px-4 py-2 rounded-md ${
            filter === "draft" ? "bg-yellow-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Brouillons
        </button>
      </div>

      {/* Tableau des produits */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12"
                    >
                      <input
                        type="checkbox"
                        checked={selectedProducts.length === currentProducts.length && currentProducts.length > 0}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Produit
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Catégorie
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Prix / Enchère
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Statut
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Vendeur
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Date de fin
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product.id)}
                          onChange={(e) => handleSelectProduct(product.id, e.target.checked)}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded flex items-center justify-center">
                            <span className="text-gray-500 font-medium">{product.title.charAt(0)}</span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{product.title}</div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">{product.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{product.category}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {product.status === "active" || product.status === "sold" ? (
                          <div>
                            <div className="text-sm text-gray-900">{product.currentBid} €</div>
                            <div className="text-xs text-gray-500">{product.bidsCount} enchères</div>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-900">{product.price} €</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(product.status)}`}
                        >
                          {getStatusLabel(product.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.seller.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.status === "draft" ? "-" : formatDate(product.endDate)}
                      </td>
                   
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Affichage de <span className="font-medium">{indexOfFirstProduct + 1}</span> à{" "}
                      <span className="font-medium">
                        {indexOfLastProduct > filteredProducts.length ? filteredProducts.length : indexOfLastProduct}
                      </span>{" "}
                      sur <span className="font-medium">{filteredProducts.length}</span> produits
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                          currentPage === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        <span className="sr-only">Précédent</span>
                        &laquo;
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => (
                        <button
                          key={i}
                          onClick={() => paginate(i + 1)}
                          className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                            currentPage === i + 1
                              ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                              : "text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}

                      <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                          currentPage === totalPages
                            ? "text-gray-300 cursor-not-allowed"
                            : "text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        <span className="sr-only">Suivant</span>
                        &raquo;
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Products

