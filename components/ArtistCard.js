import { motion } from 'framer-motion';
import { useState } from 'react';

export default function ArtistCard({ artist, index }) {
  const [imageError, setImageError] = useState(false);
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      className="glass-card p-6 hover:scale-105 transition-transform"
    >
      {/* Artist Image */}
      {artist.image && !imageError ? (
        <img
          src={artist.image}
          alt={artist.name}
          className="w-full h-64 object-cover rounded-xl mb-4"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="w-full h-64 bg-gradient-to-br from-primary-600 to-purple-600 rounded-xl mb-4 flex items-center justify-center">
          <svg className="w-20 h-20 text-white opacity-50" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        </div>
      )}

      {/* Artist Info */}
      <h3 className="text-2xl font-bold text-white mb-2">{artist.name}</h3>
      <span className="inline-block px-3 py-1 bg-primary-600 bg-opacity-30 text-primary-300 text-sm rounded-full mb-4">
        {artist.genre}
      </span>

      {/* Biography */}
      {artist.bio && (
        <div className="mb-4">
          <p className="text-gray-300 text-sm">
            {expanded ? artist.bio : `${artist.bio.substring(0, 150)}...`}
          </p>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-primary-400 text-sm mt-2 hover:underline"
          >
            {expanded ? 'Show less' : 'Read more'}
          </button>
        </div>
      )}

      {/* Link */}
      {artist.url && (
        <a
          href={artist.url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary w-full text-center"
        >
          Learn More
        </a>
      )}
    </motion.div>
  );
}

