'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function ArtistCard({ artist, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      className="glass-card p-6 hover:bg-white/10 transition-all duration-300"
    >
      <div className="flex flex-col items-center text-center">
        {artist.image ? (
          <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4">
            <Image
              src={artist.image}
              alt={artist.name}
              fill
              className="object-cover"
              sizes="128px"
            />
          </div>
        ) : (
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center mb-4">
            <span className="text-5xl">🎭</span>
          </div>
        )}

        <h3 className="text-xl font-bold text-white mb-1">{artist.name}</h3>
        <p className="text-sm text-primary-400 mb-2">{artist.category}</p>
        <p className="text-xs text-gray-400 mb-3">{artist.genre}</p>

        <p className="text-sm text-gray-300 mb-4 line-clamp-3">{artist.bio}</p>

        <div className="w-full">
          <h4 className="text-xs font-semibold text-gray-400 mb-2">Signature Works:</h4>
          <ul className="space-y-1">
            {artist.signatureWorks?.slice(0, 3).map((work, idx) => (
              <li key={idx} className="text-xs text-gray-300">
                • {work}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

