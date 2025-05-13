import {StyleSheet, TouchableOpacity,Image,View,Text} from "react-native"
import Auction from "@/src/model/Auction";
import {useNavigation} from "@react-navigation/native";

const unJour = 1000 * 3600 * 24

export default function AuctionCard( {item}: Readonly<{ item: Auction }>) {
    const navigation = useNavigation()

    const remainingTime= item.endAt !== null ? new Date(Date.now() - item.endAt.getTime()) : new Date()
    const isEnding = remainingTime.getTime() < unJour
    let remainingTimeString = remainingTime.getHours() + "h " + remainingTime.getMinutes()
    if (remainingTime.getTime() > 1000 * 3600 * 24){
        remainingTimeString = Math.round(remainingTime.getTime() / unJour) + " jours";
    }
    const image = item.images[0]?.url ? item.images[0].url : "https://www.example.com/placeholder.png"

    return (
        <TouchableOpacity
            style={styles.auctionCard}
            onPress={() => navigation.navigate("AuctionDetail", { auctionId: item.id })}
        >
            <Image
                source={{ uri: image }}
                style={styles.auctionImage}
                //defaultSource={require("../assets/placeholder.png")}
            />
            <View style={styles.auctionInfo}>
                <Text style={styles.auctionTitle} numberOfLines={1}>
                    {item.name}
                </Text>
                <Text style={styles.auctionDescription} numberOfLines={2}>
                    {item.description}
                </Text>

                <View style={styles.bidInfo}>
                    <View>
                        <Text style={styles.bidLabel}>Enchère actuelle</Text>
                        <Text style={styles.bidAmount}>{Math.max(item.highestOffer,item.startingPrice)} €</Text>
                    </View>

                    <View>
                        <Text style={styles.bidLabel}>Temps restant</Text>
                        <Text style={[styles.timeRemaining, isEnding && styles.endingSoon]}>{remainingTimeString}</Text>
                    </View>
                </View>

                <View style={styles.auctionFooter}>
                    <Text style={styles.sellerName}>Par {item.author.name}</Text>
                    <Text style={styles.bidsCount}>
                        {-1 /*#TODO*/} {-1 === 1 ? "enchère" : "enchères"}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
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
        height: 150,
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