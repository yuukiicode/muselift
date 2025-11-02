import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import SongCard from '../components/SongCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Link from 'next/link';

export default function Home() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/songs/discover?count=15');
      const data = await response.json();
      if (data.success) {
        setSongs(data.songs);
      }
    } catch (error) {
      console.error('Error fetching songs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-20"
      >
        <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Inspire. Listen. Master.
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
          Discover timeless soundscapes, from Beethoven to Baul, from Carnatic ragas to modern fusion.
        </p>
      </motion.div>

      {/* Dynamic Recommendations */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="section-title">Today's Discoveries</h2>
          <button
            onClick={fetchSongs}
            className="btn-secondary flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {songs.map((song, index) => (
              <SongCard key={index} song={song} index={index} />
            ))}
          </motion.div>
        )}
      </section>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-12 text-center"
      >
        <h3 className="text-3xl font-bold mb-4">Ready to explore more?</h3>
        <p className="text-gray-300 mb-6">
          Dive into curated categories, meet legendary artists, or sharpen your musical ear.
        </p>
        <Link href="/categories" className="btn-primary inline-block">
          Explore Categories
        </Link>
      </motion.div>
    </div>
  );
}

