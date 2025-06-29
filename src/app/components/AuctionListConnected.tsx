import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, Text, View, RefreshControl, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Auction from '@/src/model/Auction';
import AuctionCard from '@/src/app/components/AuctionCard';
import AuctionRepository from '@/src/Repository/AuctionRepository';
import { useApi } from '@/src/hooks/useApi';

interface AuctionListConnectedProps {
    filter?: string;
}

export default function AuctionListConnected(props: AuctionListConnectedProps) {
    const { filter = '' } = props;
    const [page, setPage] = useState(1);
    const [auctions, setAuctions] = useState<Auction[]>([]);
    const [hasMore, setHasMore] = useState(true);
    
    const { 
        data, 
        loading, 
        error, 
        execute: loadAuctions 
    } = useApi(
        (pageNum: number, filterParam: string) => 
            AuctionRepository.getInstance().getAuctionList(pageNum, filterParam),
        {
            onSuccess: (result) => {
                if (page === 1) {
                    setAuctions(result.data);
                } else {
                    setAuctions(prev => [...prev, ...result.data]);
                }
                setHasMore(result.current_page < result.last_page);
            },
            onError: (error) => {
                console.error('Erreur lors du chargement des enchères:', error);
            }
        }
    );

    useEffect(() => {
        loadAuctions(page, filter);
    }, [page, filter]);

    const refresh = () => {
        setPage(1);
        setAuctions([]);
        setHasMore(true);
    };

    const loadMore = () => {
        if (hasMore && !loading) {
            setPage(prev => prev + 1);
        }
    };

    const renderItem = ({ item }: { item: Auction }) => (
        <AuctionCard item={item} />
    );

    const renderFooter = () => {
        if (!loading || auctions.length === 0) return null;
        return (
            <View style={styles.footer}>
                <ActivityIndicator size="small" color="#0000ff" />
                <Text style={styles.loadingText}>Chargement...</Text>
            </View>
        );
    };

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <Feather name="inbox" size={60} color="#ccc" />
            <Text style={styles.emptyText}>
                {error ? 'Erreur lors du chargement' : 'Aucune enchère disponible'}
            </Text>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );

    return (
        <FlatList
            data={auctions}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.auctionsList}
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl 
                    refreshing={loading && auctions.length === 0} 
                    onRefresh={refresh} 
                />
            }
            ListEmptyComponent={renderEmpty}
            ListFooterComponent={renderFooter}
            onEndReached={hasMore ? loadMore : undefined}
            onEndReachedThreshold={0.1}
        />
    );
}

const styles = StyleSheet.create({
    auctionsList: {
        padding: 16,
        flexGrow: 1,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 18,
        color: '#888',
        marginTop: 16,
        textAlign: 'center',
    },
    errorText: {
        fontSize: 14,
        color: '#e74c3c',
        marginTop: 8,
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
    },
    loadingText: {
        marginLeft: 10,
        fontSize: 14,
        color: '#666',
    },
});
