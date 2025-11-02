'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import SongCard from '@/components/SongCard';

export default function Home() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/songs?count=15');
      const data = await response.json();
      setSongs(data.songs || []);
    } catch (error) {
      console.error('Error fetching songs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-6xl font-bold mb-4">
          <span className="gradient-text">Inspire. Listen. Master.</span>
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Discover timeless soundscapes, from Beethoven to Baul, from Carnatic ragas to modern fusion.
        </p>
      </motion.div>

      {/* Dynamic Recommendations */}
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">Today's Discoveries</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={fetchSongs}
          className="glass-button text-sm"
        >
          🔄 Refresh
        </motion.button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass-card p-4 h-28 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {songs.map((song, index) => (
            <SongCard key={index} song={song} index={index} />
          ))}
        </div>
      )}

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center mt-12"
      >
        <Link href="/categories">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold text-lg"
          >
            Explore More →
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
}

