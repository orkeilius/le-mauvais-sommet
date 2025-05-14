import { useState, useEffect } from "react"
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Feather } from "@expo/vector-icons"
import AuctionRepository from "@/src/Repository/AuctionRepository";
import AuctionCard from "@/src/app/components/AuctionCard";
import Auction from "@/src/model/Auction";

const AuctionsScreen = () => {
  const [auctions, setAuctions] = useState<Auction[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [filter, setFilter] = useState("all")
  console.log(auctions)
  const loadAuctions = async () => {
    try {
      AuctionRepository.getInstance().getAuctionList(0,"").then(
          (newAuctions: Auction[]) => {setAuctions(newAuctions)}
      )
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
          renderItem={elem => <AuctionCard item={elem.item} />}
          keyExtractor={item => item.id}
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

