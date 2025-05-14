"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native"
import LMSTextInput from "../../components/LMSTextInput"
import { SafeAreaView } from "react-native-safe-area-context"
import { Feather } from "@expo/vector-icons"
import { useRoute, useNavigation } from "@react-navigation/native"
import AuctionRepository from "@/src/Repository/AuctionRepository";
import Auction from "@/src/model/Auction";

const AuctionDetailScreen = () => {
  const route = useRoute()
  const navigation = useNavigation()
  const { auctionId } = route.params as { auctionId: number }

  const [auction, setAuction] = useState<Auction | null>(null)
  const [loading, setLoading] = useState(true)
  const [bidAmount, setBidAmount] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    // Chargement des détails de l'enchère
    const loadAuctionDetail = async () => {
      try {
          AuctionRepository.getInstance().getAuctionById(auctionId).then(setAuction).finally(() => setLoading(false))
      } catch (error) {
        console.error("Erreur lors du chargement des détails de l'enchère:", error)
        setLoading(false)
      }
    }

    loadAuctionDetail()
  }, [auctionId])

  // Gérer l'enchère
  const handleBid = async () => {
    if (!auction) return

    const amount = Number(bidAmount)
    if (isNaN(amount) || amount <= 0) {
      Alert.alert("Montant invalide", "Veuillez entrer un montant valide.")
      return
    }

    if (amount <= auction.highestOffer) {
      Alert.alert(
        "Enchère trop basse",
        `Votre enchère doit être supérieure à l'enchère actuelle (${auction.highestOffer} €).`,
      )
      return
    }

    setSubmitting(true)
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    )
  }

  if (!auction) {
    return (
      <View style={styles.errorContainer}>
        <Feather name="alert-circle" size={60} color="#e74c3c" />
        <Text style={styles.errorText}>Impossible de charger les détails de l'enchère</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Détails de l'enchère</Text>
        <TouchableOpacity>
          <Feather name="share-2" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Image
            source={{ uri: auction.images[0].url }}
          style={styles.auctionImage}
          //defaultSource={require("../../assets/placeholder.png")}
        />

        <View style={styles.contentContainer}>
          <Text style={styles.title}>{auction.name}</Text>

          <View style={styles.priceContainer}>
            <View>
              <Text style={styles.priceLabel}>Enchère actuelle</Text>
              <Text style={styles.currentPrice}>{Math.max(auction.highestOffer,auction.startingPrice)} €</Text>
              <Text style={styles.startingPrice}>Prix de départ: {auction.startingPrice} €</Text>
            </View>

            <View>
              <Text style={styles.timeLabel}>Temps restant</Text>
              <Text style={[styles.timeRemaining, auction.endAt.getTime() < Date.now() && styles.ended, auction.isEnding() && styles.ending]}>
                {auction.getRemainingTimeString()}
              </Text>
            </View>
          </View>

          <View style={styles.sellerContainer}>
            <Text style={styles.sectionTitle}>Vendeur</Text>
            <View style={styles.sellerInfo}>
              <Image style={styles.sellerAvatar} src={auction.author.avatarUrl} />
              <View style={styles.sellerDetails}>
                <Text style={styles.sellerName}>{auction.author.name}</Text>
                <View style={styles.ratingContainer}>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Feather
                      key={index}
                      name="star"
                      size={16}
                      color={index < Math.floor(5) ? "#f1c40f" : "#ddd"}
                      style={{ marginRight: 2 }}
                    />
                  ))}
                  <Text style={styles.ratingText}>{auction.author.rating}/5</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.descriptionContainer}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{auction.description}</Text>
          </View>

          <View style={styles.bidsContainer}>
            <Text style={styles.sectionTitle}>Historique des enchères</Text>
            {/*auction.bids.length #TODO*/  0 > 0 ? (
              auction.bids.map((bid) => (
                <View key={bid.id} style={styles.bidItem}>
                  <View style={styles.bidInfo}>
                    <Text style={styles.bidderName}>{bid.userName}</Text>
                    <Text style={styles.bidDate}>{formatDate(bid.date)}</Text>
                  </View>
                  <Text style={styles.bidAmount}>{bid.amount} €</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noBids}>Aucune enchère pour le moment</Text>
            )}
          </View>
        </View>
      </ScrollView>

      {auction.isEnded() && (

        <View style={styles.bidFormContainer}>
          <View style={{width:"60%", marginRight:12}}>
          <LMSTextInput type="label" placeholder={`Enchère min. ${auction.highestOffer + 1} €`} value={bidAmount} onChangeText={setBidAmount} />

          </View>

          <TouchableOpacity
            style={[styles.bidButton, submitting && styles.bidButtonDisabled]}
            onPress={handleBid}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.bidButtonText}>Enchérir</Text>
            )}
          </TouchableOpacity>
        </View>
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
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#666",
    marginTop: 10,
    textAlign: "center",
  },
  auctionImage: {
    width: "100%",
    height: 250,
    backgroundColor: "#f0f0f0",
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  priceLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  currentPrice: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#3498db",
    marginBottom: 2,
  },
  startingPrice: {
    fontSize: 12,
    color: "#999",
  },
  timeLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
    textAlign: "right",
  },
  timeRemaining: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2ecc71",
    textAlign: "right",
  },
  ending: {
    color: "#e74c3c",
  },
  ended: {
    color: "#999",
  },
  sellerContainer: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  sellerInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  sellerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#3498db",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  sellerInitial: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  sellerDetails: {
    flex: 1,
  },
  sellerName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 5,
  },
  descriptionContainer: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#666",
  },
  bidsContainer: {
    marginBottom: 20,
  },
  bidItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  bidInfo: {
    flex: 1,
  },
  bidderName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  bidDate: {
    fontSize: 12,
    color: "#999",
  },
  bidAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#3498db",
  },
  noBids: {
    fontSize: 16,
    color: "#999",
    fontStyle: "italic",
    textAlign: "center",
    paddingVertical: 20,
  },
  bidFormContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    justifyContent: "center",
   
    backgroundColor: "#fff",
    flexDirection: "row",
  },
  bidInput: {
    flex: 1,
    height: 50,
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  bidButton: {
    backgroundColor: "#3498db",
    borderRadius: 10,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  bidButtonDisabled: {
    backgroundColor: "#9ec6e5",
  },
  bidButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
})

export default AuctionDetailScreen

