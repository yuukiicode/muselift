'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function SongCard({ song, index = 0 }) {
  const hasImage = song.image && song.image !== '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="glass-card p-4 hover:bg-white/10 transition-all duration-300 group"
    >
      <div className="flex items-start space-x-4">
        {hasImage ? (
          <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
            <Image
              src={song.image}
              alt={song.title}
              fill
              className="object-cover"
              sizes="64px"
              onError={(e) => {
                e.target.src = '/placeholder-music.png';
              }}
            />
          </div>
        ) : (
          <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center flex-shrink-0">
            <span className="text-2xl">🎵</span>
          </div>
        )}

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white truncate group-hover:text-primary-400 transition-colors">
            {song.title}
          </h3>
          <p className="text-sm text-gray-400 truncate">{song.artist}</p>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-xs px-2 py-1 rounded-full bg-primary-500/20 text-primary-300">
              {song.genre}
            </span>
            {song.language && (
              <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-300">
                {song.language}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          {song.url && (
            <motion.a
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              href={song.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs px-3 py-1 rounded-lg bg-primary-600 hover:bg-primary-700 text-white transition-colors"
            >
              Listen
            </motion.a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

