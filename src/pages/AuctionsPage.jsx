import React, { useState, useEffect } from 'react';
import api from '../services/api';
import AuctionList from '../components/Auctions/AuctionList';

const AuctionsPage = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const response = await api.get('/auctions');
        setAuctions(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAuctions();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Liste des Enchères</h1>
      <AuctionList auctions={auctions} loading={loading} error={error} />
    </div>
  );
};

export default AuctionsPage;