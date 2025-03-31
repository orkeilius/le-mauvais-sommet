"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Feather } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"

// Types
interface Auction {
  id: string
  title: string
  description: string
  startingPrice: number
  currentBid: number
  imageUrl: string
  endDate: string
  bidsCount: number
  seller: {
    id: string
    name: string
  }
}

const AuctionsScreen = () => {
  const [auctions, setAuctions] = useState<Auction[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [filter, setFilter] = useState("all") // 'all', 'ending-soon', 'new'
  const navigation = useNavigation()

  // Fonction pour charger les enchères
  const loadAuctions = async () => {
    try {
      // Intégration avec le backend existant
      // Exemple: const response = await api.getAuctions(filter);

      // Pour la démo, on simule des données
      const mockAuctions: Auction[] = [
        {
          id: "1",
          title: "Guide complet Photoshop 2023",
          description: "PDF de 250 pages avec toutes les techniques avancées",
          startingPrice: 15,
          currentBid: 35,
          imageUrl: "https://example.com/photoshop.jpg",
          endDate: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 jours
          bidsCount: 8,
          seller: {
            id: "s1",
            name: "DesignPro",
          },
        },
        {
          id: "2",
          title: "Pack d'icônes premium",
          description: "500 icônes vectorielles pour vos projets web et mobile",
          startingPrice: 10,
          currentBid: 22,
          imageUrl: "https://example.com/icons.jpg",
          endDate: new Date(Date.now() + 86400000 * 1).toISOString(), // 1 jour
          bidsCount: 6,
          seller: {
            id: "s2",
            name: "IconMaster",
          },
        },
        {
          id: "3",
          title: "Template site e-commerce",
          description: "Template HTML/CSS/JS responsive pour boutique en ligne",
          startingPrice: 25,
          currentBid: 45,
          imageUrl: "https://example.com/template.jpg",
          endDate: new Date(Date.now() + 86400000 * 5).toISOString(), // 5 jours
          bidsCount: 12,
          seller: {
            id: "s3",
            name: "WebDev",
          },
        },
        {
          id: "4",
          title: "Ebook Marketing Digital",
          description: "Stratégies de marketing digital pour 2023",
          startingPrice: 18,
          currentBid: 18,
          imageUrl: "https://example.com/ebook.jpg",
          endDate: new Date(Date.now() + 86400000 * 3).toISOString(), // 3 jours
          bidsCount: 0,
          seller: {
            id: "s4",
            name: "MarketingPro",
          },
        },
      ]

      setAuctions(mockAuctions)
    } catch (error) {
      console.error("Erreur lors du chargement des enchères:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadAuctions()
  }, [filter])

  const onRefresh = () => {
    setRefreshing(true)
    loadAuctions()
  }

  // Calcul du temps restant
  const getRemainingTime = (endDate: string) => {
    const end = new Date(endDate).getTime()
    const now = new Date().getTime()
    const distance = end - now

    if (distance < 0) return "Terminé"

    const days = Math.floor(distance / (1000 * 60 * 60 * 24))
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

    if (days > 0) return `${days}j ${hours}h`

    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m`
  }

  const renderAuctionItem = ({ item }: { item: Auction }) => {
    const remainingTime = getRemainingTime(item.endDate)
    const isEnding = remainingTime.includes("h") && !remainingTime.includes("j")

    return (
      <TouchableOpacity
        style={styles.auctionCard}
        onPress={() => navigation.navigate("AuctionDetail", { auctionId: item.id })}
      >
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.auctionImage}
          defaultSource={require("../../assets/placeholder.png")}
        />
        <View style={styles.auctionInfo}>
          <Text style={styles.auctionTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.auctionDescription} numberOfLines={2}>
            {item.description}
          </Text>

          <View style={styles.bidInfo}>
            <View>
              <Text style={styles.bidLabel}>Enchère actuelle</Text>
              <Text style={styles.bidAmount}>{item.currentBid} €</Text>
            </View>

            <View>
              <Text style={styles.bidLabel}>Temps restant</Text>
              <Text style={[styles.timeRemaining, isEnding && styles.endingSoon]}>{remainingTime}</Text>
            </View>
          </View>

          <View style={styles.auctionFooter}>
            <Text style={styles.sellerName}>Par {item.seller.name}</Text>
            <Text style={styles.bidsCount}>
              {item.bidsCount} {item.bidsCount === 1 ? "enchère" : "enchères"}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Enchères</Text>
        <TouchableOpacity>
          <Feather name="search" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === "all" && styles.activeFilter]}
          onPress={() => setFilter("all")}
        >
          <Text style={[styles.filterText, filter === "all" && styles.activeFilterText]}>Toutes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterButton, filter === "ending-soon" && styles.activeFilter]}
          onPress={() => setFilter("ending-soon")}
        >
          <Text style={[styles.filterText, filter === "ending-soon" && styles.activeFilterText]}>
            Bientôt terminées
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterButton, filter === "new" && styles.activeFilter]}
          onPress={() => setFilter("new")}
        >
          <Text style={[styles.filterText, filter === "new" && styles.activeFilterText]}>Nouvelles</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3498db" />
        </View>
      ) : (
        <FlatList
          data={auctions}
          renderItem={renderAuctionItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.auctionsList}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Feather name="inbox" size={60} color="#ccc" />
              <Text style={styles.emptyText}>Aucune enchère disponible</Text>
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
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
  },
  activeFilter: {
    backgroundColor: "#3498db",
  },
  filterText: {
    fontSize: 14,
    color: "#666",
  },
  activeFilterText: {
    color: "#fff",
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  auctionsList: {
    padding: 15,
  },
  auctionCard: {
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
  auctionImage: {
    width: 120,
    height: "100%",
    backgroundColor: "#f0f0f0",
  },
  auctionInfo: {
    flex: 1,
    padding: 12,
  },
  auctionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  auctionDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  bidInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  bidLabel: {
    fontSize: 12,
    color: "#999",
    marginBottom: 2,
  },
  bidAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#3498db",
  },
  timeRemaining: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2ecc71",
  },
  endingSoon: {
    color: "#e74c3c",
  },
  auctionFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sellerName: {
    fontSize: 12,
    color: "#666",
  },
  bidsCount: {
    fontSize: 12,
    color: "#999",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 50,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: "#999",
  },
})

export default AuctionsScreen

