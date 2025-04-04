import React from 'react';
import AuctionCard from './AuctionCard';

const AuctionList = ({ auctions, loading, error }) => {
  if (loading) return <div>Chargement en cours...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {auctions.map((auction) => (
        <AuctionCard key={auction.id} auction={auction} />
      ))}
    </div>
  );
};

export default AuctionList;