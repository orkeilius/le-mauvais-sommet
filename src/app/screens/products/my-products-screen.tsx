"use client"

import { useState, useEffect, useContext } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert, ActivityIndicator } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Feather } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import AuctionRepository from "../../../Repository/AuctionRepository"
import { AuthContext } from "../../Store/AuthStore"
import Auction from "../../../model/Auction"

// Types
interface Product {
  id: string
  title: string
  description: string
  price: number
  imageUrl: string
  status: "draft" | "active" | "sold" | "expired"
  createdAt: string
  endDate?: string
  currentBid?: number
  bidsCount?: number
}

const MyProductsScreen = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const navigation = useNavigation<any>()
  const { user } = useContext(AuthContext)

  useEffect(() => {
    if (user) {
      loadProducts()
    }
  }, [user])

  const loadProducts = async () => {
    try {
      if (!user) {
        setLoading(false)
        return
      }

      // Récupérer les enchères de l'utilisateur connecté
      const auctions = await user.getAuction(1, "") // Page 1, tous les filtres
      
      // Transformer les enchères en produits pour la compatibilité avec l'interface
      const transformedProducts: Product[] = auctions.map((auction: Auction) => ({
        id: auction.id.toString(),
        title: auction.name,
        description: auction.description,
        price: auction.startingPrice,
        imageUrl: auction.images.length > 0 ? auction.images[0].url : "",
        status: auction.isEnded() ? "sold" : (auction.isEnding() ? "expired" : "active"),
        createdAt: auction.createdAt.toISOString(),
        endDate: auction.endAt.toISOString(),
        currentBid: auction.highestOffer,
        bidsCount: auction.offersCount || 0,
      }))

      setProducts(transformedProducts)
    } catch (error) {
      console.error("Erreur lors du chargement des produits:", error)
      
      // En cas d'erreur, utiliser des données de simulation comme fallback
      const mockProducts: Product[] = [
        {
          id: "p1",
          title: "Ebook Design UX/UI",
          description: "Guide complet sur les principes de design UX/UI",
          price: 25,
          imageUrl: "https://example.com/ebook.jpg",
          status: "active",
          createdAt: "2023-03-10T14:30:00Z",
          endDate: "2023-04-10T14:30:00Z",
          currentBid: 35,
          bidsCount: 4,
        },
        {
          id: "p2",
          title: "Template site portfolio",
          description: "Template HTML/CSS pour portfolio de designer",
          price: 15,
          imageUrl: "https://example.com/template.jpg",
          status: "draft",
          createdAt: "2023-03-15T10:15:00Z",
        },
        {
          id: "p3",
          title: "Pack d'illustrations",
          description: "50 illustrations vectorielles pour vos projets",
          price: 20,
          imageUrl: "https://example.com/illustrations.jpg",
          status: "sold",
          createdAt: "2023-02-20T09:45:00Z",
          endDate: "2023-03-20T09:45:00Z",
          currentBid: 30,
          bidsCount: 6,
        },
        {
          id: "p4",
          title: "Guide SEO 2023",
          description: "Stratégies SEO pour améliorer votre référencement",
          price: 18,
          imageUrl: "https://example.com/seo.jpg",
          status: "expired",
          createdAt: "2023-01-05T16:20:00Z",
          endDate: "2023-02-05T16:20:00Z",
          currentBid: 18,
          bidsCount: 0,
        },
      ]

      setProducts(mockProducts)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const onRefresh = () => {
    setRefreshing(true)
    loadProducts()
  }

  const handleAddProduct = () => {
    navigation.navigate("AddProduct")
  }

  const handleEditProduct = (productId: string) => {
    navigation.navigate("AddProduct", { productId })
  }

  const handleDeleteProduct = (productId: string) => {
    Alert.alert("Supprimer le produit", "Êtes-vous sûr de vouloir supprimer ce produit ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: async () => {
          try {
            const auctionRepository = AuctionRepository.getInstance()
            await auctionRepository.deleteAuction(parseInt(productId))
            
            // Retirer le produit de la liste locale après suppression réussie
            setProducts(products.filter((p) => p.id !== productId))
            Alert.alert("Succès", "Produit supprimé avec succès")
          } catch (error) {
            console.error("Erreur lors de la suppression:", error)
            Alert.alert("Erreur", "Impossible de supprimer le produit")
          }
        },
      },
    ])
  }

  const handleViewProduct = (productId: string) => {
   navigation.navigate("AuctionDetail", { productId})
  }
  

  const getStatusLabel = (status: Product["status"]) => {
    switch (status) {
      case "draft":
        return "Brouillon"
      case "active":
        return "En vente"
      case "sold":
        return "Vendu"
      case "expired":
        return "Expiré"
      default:
        return status
    }
  }

  const getStatusColor = (status: Product["status"]) => {
    switch (status) {
      case "draft":
        return "#f39c12"
      case "active":
        return "#2ecc71"
      case "sold":
        return "#3498db"
      case "expired":
        return "#e74c3c"
      default:
        return "#999"
    }
  }

  const renderProductItem = ({ item }: { item: Product }) => {
    const statusColor = getStatusColor(item.status)
    const canEdit = item.status === "draft"
    const canDelete = item.status === "draft" || item.status === "expired"

    return (
      <View style={styles.productCard}>
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.productImage}
          defaultSource={require("../../assets/placeholder.png")}
        />

        <View style={styles.productContent}>
          <View style={styles.productHeader}>
            <Text style={styles.productTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
              <Text style={styles.statusText}>{getStatusLabel(item.status)}</Text>
            </View>
          </View>

          <Text style={styles.productDescription} numberOfLines={2}>
            {item.description}
          </Text>

          <View style={styles.productDetails}>
            <Text style={styles.priceText}>
              {item.status === "active" || item.status === "sold"
                ? `Enchère: ${item.currentBid} €`
                : `Prix: ${item.price} €`}
            </Text>

            {(item.status === "active" || item.status === "sold") && (
              <Text style={styles.bidsText}>
                {item.bidsCount} {item.bidsCount === 1 ? "enchère" : "enchères"}
              </Text>
            )}
          </View>

          <View style={styles.productActions}>
            {canEdit && (
              <TouchableOpacity style={styles.actionButton} onPress={() => handleEditProduct(item.id)}>
                <Feather name="edit" size={16} color="#3498db" />
                <Text style={styles.actionText}>Modifier</Text>
              </TouchableOpacity>
            )}

            {canDelete && (
              <TouchableOpacity style={styles.actionButton} onPress={() => handleDeleteProduct(item.id)}>
                <Feather name="trash-2" size={16} color="#e74c3c" />
                <Text style={[styles.actionText, { color: "#e74c3c" }]}>Supprimer</Text>
              </TouchableOpacity>
            )}

            {item.status === "active" && (
              <TouchableOpacity style={styles.actionButton} onPress={() => handleViewProduct(item.id)}>
                <Feather name="eye" size={16} color="#3498db" />
                <Text style={styles.actionText}>Voir</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mes Produits</Text>
        <TouchableOpacity onPress={handleAddProduct}>
          <Feather name="plus-circle" size={24} color="#3498db" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size={40} color="#3498db" />
        </View>
      ) : (
        <FlatList
          data={products}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.productsList}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={onRefresh}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Feather name="package" size={60} color="#ccc" />
              <Text style={styles.emptyText}>Vous n'avez pas encore de produits</Text>
              <TouchableOpacity style={styles.addButton} onPress={handleAddProduct}>
                <Text style={styles.addButtonText}>Ajouter un produit</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  productsList: {
    padding: 15,
  },
  productCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  productImage: {
    width: 100,
    height: "100%",
    backgroundColor: "#f0f0f0",
  },
  productContent: {
    flex: 1,
    padding: 12,
  },
  productHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#fff",
  },
  productDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  productDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  priceText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3498db",
  },
  bidsText: {
    fontSize: 12,
    color: "#999",
  },
  productActions: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  actionText: {
    fontSize: 12,
    color: "#3498db",
    marginLeft: 4,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 50,
  },
  emptyText: {
    marginTop: 10,
    marginBottom: 20,
    fontSize: 16,
    color: "#999",
    textAlign: "center",
  },
  addButton: {
    backgroundColor: "#3498db",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
})

export default MyProductsScreen

