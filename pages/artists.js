import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import ArtistCard from '../components/ArtistCard';
import LoadingSpinner from '../components/LoadingSpinner';

const ARTIST_CATEGORIES = [
  { id: 'all', name: 'All Legends', emoji: '⭐' },
  { id: 'vocalists', name: 'Best Vocalists', emoji: '🎤' },
  { id: 'guitarists', name: 'Best Guitarists', emoji: '🎸' },
  { id: 'drummers', name: 'Best Drummers', emoji: '🥁' },
  { id: 'bassists', name: 'Best Bassists', emoji: '🎸' },
  { id: 'pianists', name: 'Pianists & Composers', emoji: '🎹' },
  { id: 'bands', name: 'Legendary Bands', emoji: '🎵' },
  { id: 'indian', name: 'Indian Masters', emoji: '🇮🇳' },
];

export default function Artists() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchArtists();
  }, [selectedCategory]);

  const fetchArtists = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/artists/legends?category=${selectedCategory}`);
      const data = await response.json();
      
      if (data.success) {
        setArtists(data.artists);
      }
    } catch (error) {
      console.error('Error fetching artists:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">
          Legends & Masters
        </h1>
        <p className="text-gray-300 text-lg">
          Celebrate the artists who shaped music history
        </p>
      </motion.div>

      {/* Category Selection */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-semibold mb-4">Categories</h3>
        <div className="flex flex-wrap gap-3">
          {ARTIST_CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                selectedCategory === category.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-white bg-opacity-10 text-gray-300 hover:bg-opacity-20'
              }`}
            >
              <span className="mr-2">{category.emoji}</span>
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Artists Grid */}
      <section>
        <h2 className="section-title">
          {ARTIST_CATEGORIES.find(c => c.id === selectedCategory)?.name}
        </h2>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {artists.map((artist, index) => (
              <ArtistCard key={index} artist={artist} index={index} />
            ))}
          </motion.div>
        )}

        {/* Refresh Button */}
        <div className="text-center mt-8">
          <button
            onClick={fetchArtists}
            className="btn-secondary"
          >
            <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Discover More Artists
          </button>
        </div>
      </section>
    </div>
  );
}

