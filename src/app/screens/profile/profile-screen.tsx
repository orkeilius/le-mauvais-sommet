"use client"

import {useContext, useEffect, useState} from "react"
import {Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native"
import {SafeAreaView} from "react-native-safe-area-context"
import {Feather} from "@expo/vector-icons"
import {useNavigation} from "@react-navigation/native"
import {AuthContext} from "@/src/app/Store/AuthStore";
import User from "@/src/model/User";
import Auction from "@/src/model/Auction";
import AuctionList from "@/src/app/components/AuctionList";

// 'purchases', 'sales', 'active'

function ProfileScreen() {
    const authContext = useContext(AuthContext);
    const user: User = authContext.user as User;
    const [activeTab, setActiveTab] = useState<"purchases" | "sales" | "active">("purchases")
    const navigation = useNavigation()
    const [auctions, setAuctions] = useState<Auction[]>([])


    useEffect(() => {
        if (activeTab === "purchases") {
            user.getAuction(1, "won").then(setAuctions)
        } else if (activeTab === "sales") {
            user.getAuction(1, "ended").then(setAuctions)
        } else {
            user.getAuction(1, "ongoing").then(setAuctions)
        }
    }, [activeTab]);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Profil</Text>
                    <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
                        <Feather name="settings" size={24} color="#333"/>
                    </TouchableOpacity>
                </View>

                <View showsVerticalScrollIndicator={false}>
                    <View style={styles.profileHeader}>
                        <Image
                            source={{uri: user.avatarUrl}}
                            style={styles.avatar}
                        />
                        <View style={styles.profileInfo}>
                            <Text style={styles.userName}>{user.name}</Text>
                            {/*<Text style={styles.userEmail}>{user}</Text>*/}
                            <Text style={styles.joinDate}>Membre depuis {user.createdAt.toLocaleDateString()}</Text>
                        </View>
                    </View>

                    <View style={styles.statsContainer}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{user.stats?.auctions_ended}</Text>
                            <Text style={styles.statLabel}>Ventes</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{user.stats?.auctions_ongoing}</Text>
                            <Text style={styles.statLabel}>En cours</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{user.stats?.auctions_won}</Text>
                            <Text style={styles.statLabel}>Gagnées</Text>
                        </View>
                    </View>

                    <View style={styles.tabsContainer}>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === "purchases" && styles.activeTab]}
                            onPress={() => setActiveTab("purchases")}
                        >
                            <Text style={[styles.tabText, activeTab === "purchases" && styles.activeTabText]}>Mes
                                achats</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === "sales" && styles.activeTab]}
                            onPress={() => setActiveTab("sales")}
                        >
                            <Text style={[styles.tabText, activeTab === "sales" && styles.activeTabText]}>Mes
                                ventes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === "active" && styles.activeTab]}
                            onPress={() => setActiveTab("active")}
                        >
                            <Text style={[styles.tabText, activeTab === "active" && styles.activeTabText]}>Enchères
                                actives</Text>
                        </TouchableOpacity>
                    </View>

                       <AuctionList auctions={auctions} />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:
            "#f8f9fa",
    }
    ,
    header: {
        flexDirection: "row",
        justifyContent:
            "space-between",
        alignItems:
            "center",
        paddingHorizontal:
            20,
        paddingVertical:
            15,
        borderBottomWidth:
            1,
        borderBottomColor:
            "#eee",
    }
    ,
    headerTitle: {
        fontSize: 22,
        fontWeight:
            "bold",
        color:
            "#333",
    },
    profileHeader: {
        flexDirection: "row",
        alignItems:
            "center",
        padding:
            20,
        borderBottomWidth:
            1,
        borderBottomColor:
            "#eee",
    }
    ,
    avatar: {
        width: 80,
        height:
            80,
        borderRadius:
            40,
        backgroundColor:
            "#f0f0f0",
    }
    ,
    profileInfo: {
        marginLeft: 15,
        flex:
            1,
    }
    ,
    userName: {
        fontSize: 20,
        fontWeight:
            "bold",
        color:
            "#333",
        marginBottom:
            4,
    }
    ,
    userEmail: {
        fontSize: 14,
        color:
            "#666",
        marginBottom:
            4,
    }
    ,
    joinDate: {
        fontSize: 12,
        color:
            "#999",
    }
    ,
    statsContainer: {
        flexDirection: "row",
        justifyContent:
            "space-around",
        paddingVertical:
            15,
        borderBottomWidth:
            1,
        borderBottomColor:
            "#eee",
    }
    ,
    statItem: {
        alignItems: "center",
    }
    ,
    statValue: {
        fontSize: 18,
        fontWeight:
            "bold",
        color:
            "#3498db",
        marginBottom:
            4,
    }
    ,
    statLabel: {
        fontSize: 12,
        color:
            "#666",
    }
    ,
    tabsContainer: {
        flexDirection: "row",
        borderBottomWidth:
            1,
        borderBottomColor:
            "#eee",
    }
    ,
    tab: {
        flex: 1,
        paddingVertical:
            15,
        alignItems:
            "center",
    }
    ,
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor:
            "#3498db",
    }
    ,
    tabText: {
        fontSize: 14,
        color:
            "#666",
    }
    ,
    activeTabText: {
        color: "#3498db",
        fontWeight:
            "600",
    }
})

export default ProfileScreen

