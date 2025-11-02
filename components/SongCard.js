import { motion } from 'framer-motion';
import { useState } from 'react';

export default function SongCard({ song, index }) {
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="glass-card p-6 hover:scale-105 transition-transform"
    >
      {/* Album Art */}
      {song.image && !imageError ? (
        <img
          src={song.image}
          alt={song.title}
          className="w-full h-48 object-cover rounded-xl mb-4"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="w-full h-48 bg-gradient-to-br from-primary-600 to-purple-600 rounded-xl mb-4 flex items-center justify-center">
          <svg className="w-16 h-16 text-white opacity-50" fill="currentColor" viewBox="0 0 20 20">
            <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
          </svg>
        </div>
      )}

      {/* Song Info */}
      <h3 className="text-xl font-bold text-white mb-2 truncate">
        {song.title}
      </h3>
      <p className="text-gray-300 mb-1 truncate">{song.artist}</p>
      
      <div className="flex gap-2 mb-4 flex-wrap">
        <span className="px-3 py-1 bg-primary-600 bg-opacity-30 text-primary-300 text-sm rounded-full">
          {song.genre}
        </span>
        <span className="px-3 py-1 bg-purple-600 bg-opacity-30 text-purple-300 text-sm rounded-full">
          {song.language}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        {song.url && (
          <a
            href={song.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 btn-primary text-center text-sm"
          >
            Listen
          </a>
        )}
        {song.previewUrl && (
          <a
            href={song.previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-xl transition-all"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          </a>
        )}
      </div>
    </motion.div>
  );
}

