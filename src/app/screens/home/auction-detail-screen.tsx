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
import { LMSTextInput } from "../../components/LMSTextInput"
import { SafeAreaView } from "react-native-safe-area-context"
import { Feather } from "@expo/vector-icons"
import { useRoute, useNavigation } from "@react-navigation/native"

// Types
interface AuctionDetail {
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
    rating: number
  }
  bids: Array<{
    id: string
    userId: string
    userName: string
    amount: number
    date: string
  }>
}

const AuctionDetailScreen = () => {
  const route = useRoute()
  const navigation = useNavigation()
  const { auctionId } = route.params as { auctionId: string }

  const [auction, setAuction] = useState<AuctionDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [bidAmount, setBidAmount] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    // Chargement des détails de l'enchère
    const loadAuctionDetail = async () => {
      try {
        // Intégration avec le backend existant
        // Exemple: const response = await api.getAuctionDetail(auctionId);

        // Pour la démo, on simule des données
        setTimeout(() => {
          const mockAuction: AuctionDetail = {
            id: auctionId,
            title: "Guide complet Photoshop 2023",
            description:
              "PDF de 250 pages avec toutes les techniques avancées pour la retouche photo, la création de maquettes, et les effets spéciaux. Inclut également des vidéos tutoriels exclusives et des fichiers sources pour tous les exercices.",
            startingPrice: 15,
            currentBid: 35,
            imageUrl: "https://example.com/photoshop.jpg",
            endDate: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 jours
            bidsCount: 8,
            seller: {
              id: "s1",
              name: "DesignPro",
              rating: 4.7,
            },
            bids: [
              {
                id: "b1",
                userId: "u1",
                userName: "JeanDupont",
                amount: 35,
                date: new Date(Date.now() - 3600000).toISOString(), // 1 heure
              },
              {
                id: "b2",
                userId: "u2",
                userName: "SophieLemaire",
                amount: 30,
                date: new Date(Date.now() - 7200000).toISOString(), // 2 heures
              },
              {
                id: "b3",
                userId: "u3",
                userName: "MarcDubois",
                amount: 25,
                date: new Date(Date.now() - 10800000).toISOString(), // 3 heures
              },
            ],
          }

          setAuction(mockAuction)
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Erreur lors du chargement des détails de l'enchère:", error)
        setLoading(false)
      }
    }

    loadAuctionDetail()
  }, [auctionId])

  // Calcul du temps restant
  const getRemainingTime = (endDate: string) => {
    const end = new Date(endDate).getTime()
    const now = new Date().getTime()
    const distance = end - now

    if (distance < 0) return "Terminé"

    const days = Math.floor(distance / (1000 * 60 * 60 * 24))
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))

    if (days > 0) return `${days}j ${hours}h`
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  // Formater la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Gérer l'enchère
  const handleBid = async () => {
    if (!auction) return

    const amount = Number(bidAmount)
    if (isNaN(amount) || amount <= 0) {
      Alert.alert("Montant invalide", "Veuillez entrer un montant valide.")
      return
    }

    if (amount <= auction.currentBid) {
      Alert.alert(
        "Enchère trop basse",
        `Votre enchère doit être supérieure à l'enchère actuelle (${auction.currentBid} €).`,
      )
      return
    }

    setSubmitting(true)

    try {
      // Intégration avec le backend existant
      // Exemple: const response = await api.placeBid(auctionId, amount);

      // Pour la démo, on simule une réponse
      setTimeout(() => {
        // Mettre à jour l'enchère localement
        setAuction({
          ...auction,
          currentBid: amount,
          bidsCount: auction.bidsCount + 1,
          bids: [
            {
              id: `b${auction.bids.length + 1}`,
              userId: "currentUser",
              userName: "Vous",
              amount: amount,
              date: new Date().toISOString(),
            },
            ...auction.bids,
          ],
        })

        setBidAmount("")
        Alert.alert("Enchère placée", "Votre enchère a été placée avec succès.")
        setSubmitting(false)
      }, 1000)
    } catch (error) {
      console.error("Erreur lors de l'enchère:", error)
      Alert.alert("Erreur", "Impossible de placer votre enchère. Veuillez réessayer.")
      setSubmitting(false)
    }
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

  const remainingTime = getRemainingTime(auction.endDate)
  const isEnded = remainingTime === "Terminé"
  const isEnding = remainingTime.includes("h") && !remainingTime.includes("j")

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
          source={{ uri: auction.imageUrl }}
          style={styles.auctionImage}
          defaultSource={require("../../assets/placeholder.png")}
        />

        <View style={styles.contentContainer}>
          <Text style={styles.title}>{auction.title}</Text>

          <View style={styles.priceContainer}>
            <View>
              <Text style={styles.priceLabel}>Enchère actuelle</Text>
              <Text style={styles.currentPrice}>{auction.currentBid} €</Text>
              <Text style={styles.startingPrice}>Prix de départ: {auction.startingPrice} €</Text>
            </View>

            <View>
              <Text style={styles.timeLabel}>Temps restant</Text>
              <Text style={[styles.timeRemaining, isEnded && styles.ended, isEnding && styles.ending]}>
                {remainingTime}
              </Text>
            </View>
          </View>

          <View style={styles.sellerContainer}>
            <Text style={styles.sectionTitle}>Vendeur</Text>
            <View style={styles.sellerInfo}>
              <View style={styles.sellerAvatar}>
                <Text style={styles.sellerInitial}>{auction.seller.name.charAt(0)}</Text>
              </View>
              <View style={styles.sellerDetails}>
                <Text style={styles.sellerName}>{auction.seller.name}</Text>
                <View style={styles.ratingContainer}>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Feather
                      key={index}
                      name="star"
                      size={16}
                      color={index < Math.floor(auction.seller.rating) ? "#f1c40f" : "#ddd"}
                      style={{ marginRight: 2 }}
                    />
                  ))}
                  <Text style={styles.ratingText}>{auction.seller.rating}/5</Text>
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
            {auction.bids.length > 0 ? (
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

      {!isEnded && (

        <View style={styles.bidFormContainer}>
          <View style={{width:"60%", marginRight:12}}>
          <LMSTextInput type="label" placeholder={`Enchère min. ${auction.currentBid + 1} €`} value={bidAmount} onChangeText={setBidAmount} />

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

