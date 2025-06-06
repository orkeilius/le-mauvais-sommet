import {useEffect, useState} from "react"
import {StyleSheet, Text, TouchableOpacity, View,} from "react-native"
import {SafeAreaView} from "react-native-safe-area-context"
import {Feather} from "@expo/vector-icons"
import AuctionRepository from "@/src/Repository/AuctionRepository";
import Auction from "@/src/model/Auction";
import AuctionList from "@/src/app/components/AuctionList";
import LMSFilter from "@/src/app/components/Filtre";
import SearchButton from "@/src/app/components/SearchButton";
import AuctionSearch from "@/src/app/components/AuctionSearch";


const AuctionsScreen = () => {
    const [auctions, setAuctions] = useState<Auction[]>([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [filter, setFilter] = useState<"" | "endsood" | "new" | "highest">("")
    const loadAuctions = async () => {
        try {
            AuctionRepository.getInstance().getAuctionList(0, filter).then(
                (newAuctions: Auction[]) => {
                    setAuctions(newAuctions)
                }
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


    const handleSearch = async (query: string) => {
        setLoading(true);
        try {
            const results = await AuctionRepository.getInstance().getAuctionList(0, filter, query);
            setAuctions(results);
        } catch (error) {
            console.error("Erreur lors de la recherche:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Enchères</Text>
                <SearchButton />
            </View>
            <AuctionSearch onSearch={handleSearch} />
            <LMSFilter filter={filter} setFilter={setFilter} options={["all","endsoon","new","highest"]}/>
            <AuctionList auctions={auctions}/>


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
    auctionCard: {
        flexDirection: "row",
        backgroundColor: "#fff",
        borderRadius: 12,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
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
    }
})

export default AuctionsScreen
