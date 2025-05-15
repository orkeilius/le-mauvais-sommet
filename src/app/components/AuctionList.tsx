import Auction from "@/src/model/Auction";
import {FlatList, StyleSheet, Text, View} from "react-native";
import AuctionCard from "@/src/app/components/AuctionCard";
import {Feather} from "@expo/vector-icons";
import {Suspense} from "react";

interface InputProps {
    auctions: Auction[];
}

export default function AuctionList(props: Readonly<InputProps>) {


    return (
        <Suspense fallback={<Text>Loading...</Text>}>
            <FlatList
                data={props.auctions}
                renderItem={elem => <AuctionCard item={elem.item}/>}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.auctionsList}
                showsVerticalScrollIndicator={false}
                //refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Feather name="inbox" size={60} color="#ccc"/>
                        <Text style={styles.emptyText}>Aucune enchère disponible</Text>
                    </View>
                }
            />
        </Suspense>
    )
}

const styles = StyleSheet.create({
    auctionsList: {
        padding: 15,
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