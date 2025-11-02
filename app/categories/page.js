'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SongCard from '@/components/SongCard';
import { GENRES, LANGUAGES } from '@/lib/constants';

export default function CategoriesPage() {
  const [activeTab, setActiveTab] = useState('genres');
  const [selectedCategory, setSelectedCategory] = useState('Jazz');
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchCategorySongs();
  }, [selectedCategory, activeTab]);

  const fetchCategorySongs = async () => {
    setLoading(true);
    try {
      const type = activeTab === 'genres' ? 'genre' : 'language';
      const response = await fetch(`/api/songs?${type}=${selectedCategory}&count=20`);
      const data = await response.json();
      setSongs(data.songs || []);
      setPage(1);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    setLoading(true);
    try {
      const type = activeTab === 'genres' ? 'genre' : 'language';
      const response = await fetch(`/api/songs?${type}=${selectedCategory}&count=15`);
      const data = await response.json();
      setSongs(prev => [...prev, ...(data.songs || [])]);
      setPage(p => p + 1);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = activeTab === 'genres' ? GENRES : LANGUAGES;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-5xl font-bold mb-8 gradient-text"
      >
        Explore by Category
      </motion.h1>

      {/* Tab Selector */}
      <div className="flex space-x-4 mb-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setActiveTab('genres');
            setSelectedCategory('Jazz');
          }}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            activeTab === 'genres'
              ? 'bg-primary-600 text-white'
              : 'glass-card text-gray-300'
          }`}
        >
          Genres
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setActiveTab('languages');
            setSelectedCategory('Hindi');
          }}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            activeTab === 'languages'
              ? 'bg-primary-600 text-white'
              : 'glass-card text-gray-300'
          }`}
        >
          Languages
        </motion.button>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-3 mb-8">
        {categories.map((cat) => (
          <motion.button
            key={cat}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedCategory === cat
                ? 'bg-gradient-to-r from-primary-500 to-purple-500 text-white'
                : 'glass-card text-gray-300 hover:bg-white/10'
            }`}
          >
            {cat}
          </motion.button>
        ))}
      </div>

      {/* Must Hear Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-4">
          Must Hear: {selectedCategory}
        </h2>
        {loading && page === 1 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass-card p-4 h-28 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {songs.slice(0, 6).map((song, index) => (
              <SongCard key={index} song={song} index={index} />
            ))}
          </div>
        )}
      </div>

      {/* Explore More Section */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Explore More</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {songs.slice(6).map((song, index) => (
            <SongCard key={index + 6} song={song} index={index} />
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={loadMore}
            disabled={loading}
            className="px-8 py-4 rounded-lg bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-semibold"
          >
            {loading ? 'Loading...' : 'Load More'}
          </motion.button>
        </div>
      </div>
    </div>
  );
}

