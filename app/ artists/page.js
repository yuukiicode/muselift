'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import ArtistCard from '@/components/ArtistCard';
import { LEGENDARY_ARTISTS } from '@/lib/constants';

export default function ArtistsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Composers', 'Bands', 'Guitarists', 'Vocalists', 'Percussionists'];

  const filteredArtists =
    selectedCategory === 'All'
      ? LEGENDARY_ARTISTS
      : LEGENDARY_ARTISTS.filter((artist) => artist.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl font-bold mb-4 gradient-text">Legends & Masters</h1>
        <p className="text-xl text-gray-300">
          Celebrating the icons who shaped music across cultures and generations
        </p>
      </motion.div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {categories.map((cat) => (
          <motion.button
            key={cat}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
              selectedCategory === cat
                ? 'bg-gradient-to-r from-primary-500 to-purple-500 text-white'
                : 'glass-card text-gray-300 hover:bg-white/10'
            }`}
          >
            {cat}
          </motion.button>
        ))}
      </div>

      {/* Artists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArtists.map((artist, index) => (
          <ArtistCard key={index} artist={artist} index={index} />
        ))}
      </div>
    </div>
  );
}
