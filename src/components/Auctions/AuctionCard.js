import React from 'react';
import { Link } from 'react-router-dom';

const AuctionCard = ({ auction }) => {
  return (
    <div className="border rounded-lg p-4 shadow hover:shadow-md transition-shadow">
      <h2 className="text-xl font-semibold mb-2">{auction.title}</h2>
      <p className="text-gray-600 mb-2">{auction.description}</p>
      <p className="text-gray-800 font-medium">
        Prix de départ: {auction.starting_price} €
      </p>
      <p className="text-sm text-gray-500">
        Fin de l'enchère: {new Date(auction.end_date).toLocaleDateString()}
      </p>
      <Link
        to={`/auctions/${auction.id}`}
        className="mt-3 inline-block text-blue-600 hover:text-blue-800"
      >
        Voir détails
      </Link>
    </div>
  );
};

export default AuctionCard;