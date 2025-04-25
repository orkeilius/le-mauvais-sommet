"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Feather } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"

const ProfileScreen = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("purchases") // 'purchases', 'sales', 'active'
  const navigation = useNavigation()

  useEffect(() => {
    // Charger les données de l'utilisateur
    const loadUserData = async () => {
      try {
        // Intégration avec le backend existant
        // Exemple: const response = await api.getUserProfile();

        // Pour la démo, on simule des données
        const mockUser: User = {
          id: "u1",
          name: "Dorothy NIKKE",
          email: "dorothy.nikke@example.com",
          avatar: "https://images.steamusercontent.com/ugc/2504647575814690088/C5BF72CF927233F1C50E8A035A61B79CAA900A3B/?imw=512&&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false",
          joinDate: "2022-05-15",
          stats: {
            totalSales: 12,
            totalPurchases: 8,
            activeAuctions: 3,
            wonAuctions: 5,
          },
        }

        setUser(mockUser)
      } catch (error) {
        console.error("Erreur lors du chargement du profil:", error)
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [])

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    )
  }

  if (!user) {
    return (
      <View style={styles.errorContainer}>
        <Feather name="alert-circle" size={60} color="#e74c3c" />
        <Text style={styles.errorText}>Impossible de charger le profil</Text>
      </View>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" })
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profil</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
          <Feather name="settings" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <Image
            source={{ uri: user.avatar }}
            style={styles.avatar}
            defaultSource={require("../../assets/default-avatar.png")}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            <Text style={styles.joinDate}>Membre depuis {formatDate(user.joinDate)}</Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user.stats.totalSales}</Text>
            <Text style={styles.statLabel}>Ventes</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user.stats.totalPurchases}</Text>
            <Text style={styles.statLabel}>Achats</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user.stats.activeAuctions}</Text>
            <Text style={styles.statLabel}>Actives</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user.stats.wonAuctions}</Text>
            <Text style={styles.statLabel}>Gagnées</Text>
          </View>
        </View>

        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "purchases" && styles.activeTab]}
            onPress={() => setActiveTab("purchases")}
          >
            <Text style={[styles.tabText, activeTab === "purchases" && styles.activeTabText]}>Mes achats</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "sales" && styles.activeTab]}
            onPress={() => setActiveTab("sales")}
          >
            <Text style={[styles.tabText, activeTab === "sales" && styles.activeTabText]}>Mes ventes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "active" && styles.activeTab]}
            onPress={() => setActiveTab("active")}
          >
            <Text style={[styles.tabText, activeTab === "active" && styles.activeTabText]}>Enchères actives</Text>
          </TouchableOpacity>
        </View>

        {activeTab === "purchases" && (
          <View style={styles.tabContent}>
            {/* Contenu pour les achats */}
            <Text style={styles.emptyTabText}>Vous n'avez pas encore d'achats</Text>
          </View>
        )}

        {activeTab === "sales" && (
          <View style={styles.tabContent}>
            {/* Contenu pour les ventes */}
            <Text style={styles.emptyTabText}>Vous n'avez pas encore de ventes</Text>
          </View>
        )}

        {activeTab === "active" && (
          <View style={styles.tabContent}>
            {/* Contenu pour les enchères actives */}
            <Text style={styles.emptyTabText}>Vous n'avez pas d'enchères actives</Text>
          </View>
        )}
      </ScrollView>
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
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#f0f0f0",
  },
  profileInfo: {
    marginLeft: 15,
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  joinDate: {
    fontSize: 12,
    color: "#999",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3498db",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
  },
  tabsContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#3498db",
  },
  tabText: {
    fontSize: 14,
    color: "#666",
  },
  activeTabText: {
    color: "#3498db",
    fontWeight: "600",
  },
  tabContent: {
    padding: 20,
    minHeight: 200,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTabText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
  },
})

export default ProfileScreen

