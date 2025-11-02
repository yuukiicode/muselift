import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import SongCard from '../components/SongCard';
import LoadingSpinner from '../components/LoadingSpinner';

const CATEGORIES = [
  { id: 'jazz', name: 'Jazz', emoji: '🎷' },
  { id: 'classical', name: 'Classical', emoji: '🎻' },
  { id: 'rock', name: 'Rock', emoji: '🎸' },
  { id: 'pop', name: 'Pop', emoji: '🎤' },
  { id: 'lofi', name: 'Lo-Fi', emoji: '☕' },
  { id: 'blues', name: 'Blues', emoji: '🎺' },
  { id: 'funk', name: 'Funk', emoji: '🕺' },
  { id: 'metal', name: 'Metal', emoji: '🤘' },
  { id: 'folk', name: 'Folk', emoji: '🪕' },
  { id: 'fusion', name: 'Fusion', emoji: '🎼' },
  { id: 'alternative', name: 'Alternative', emoji: '🎧' },
  { id: 'atmospheric', name: 'Atmospheric', emoji: '🌌' },
  { id: 'cozy', name: 'Cozy', emoji: '🔥' },
  { id: 'hindi', name: 'Hindi', emoji: '🇮🇳' },
  { id: 'malayalam', name: 'Malayalam', emoji: '🌴' },
  { id: 'tamil', name: 'Tamil', emoji: '🎵' },
  { id: 'carnatic', name: 'Carnatic', emoji: '🪘' },
  { id: 'indian-fusion', name: 'Indian Fusion', emoji: '🎶' },
];

const MOODS = [
  { id: 'chill', name: 'Chill' },
  { id: 'energetic', name: 'Energetic' },
  { id: 'emotional', name: 'Emotional' },
  { id: 'devotional', name: 'Devotional' },
  { id: 'fusion', name: 'Fusion' },
  { id: 'atmospheric', name: 'Atmospheric' },
];

export default function Categories() {
  const [selectedCategory, setSelectedCategory] = useState('jazz');
  const [selectedMood, setSelectedMood] = useState(null);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchSongs();
  }, [selectedCategory, selectedMood]);

  const fetchSongs = async (loadMore = false) => {
    setLoading(true);
    try {
      const moodParam = selectedMood ? `&mood=${selectedMood}` : '';
      const response = await fetch(
        `/api/songs/category?category=${selectedCategory}&limit=30${moodParam}`
      );
      const data = await response.json();
      
      if (data.success) {
        setSongs(loadMore ? [...songs, ...data.songs] : data.songs);
        if (loadMore) setPage(page + 1);
      }
    } catch (error) {
      console.error('Error fetching songs:', error);
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
          Explore Categories
        </h1>
        <p className="text-gray-300 text-lg">
          Discover music across genres, languages, and moods
        </p>
      </motion.div>

      {/* Category Tabs */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-semibold mb-4">Genres & Languages</h3>
        <div className="flex flex-wrap gap-3">
          {CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                setSelectedCategory(category.id);
                setPage(1);
              }}
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

      {/* Mood Selector */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-semibold mb-4">
          Filter by Mood 
          <span className="text-sm text-gray-400 ml-2">(AI-Powered)</span>
        </h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setSelectedMood(null)}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              !selectedMood
                ? 'bg-purple-600 text-white'
                : 'bg-white bg-opacity-10 text-gray-300 hover:bg-opacity-20'
            }`}
          >
            All
          </button>
          {MOODS.map((mood) => (
            <button
              key={mood.id}
              onClick={() => setSelectedMood(mood.id)}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                selectedMood === mood.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-white bg-opacity-10 text-gray-300 hover:bg-opacity-20'
              }`}
            >
              {mood.name}
            </button>
          ))}
        </div>
      </div>

      {/* Songs Grid */}
      <section>
        <h2 className="section-title">
          {CATEGORIES.find(c => c.id === selectedCategory)?.name} 
          {selectedMood && ` - ${MOODS.find(m => m.id === selectedMood)?.name}`}
        </h2>

        {loading && songs.length === 0 ? (
          <LoadingSpinner />
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {songs.map((song, index) => (
                <SongCard key={index} song={song} index={index} />
              ))}
            </motion.div>

            {/* Load More */}
            <div className="text-center mt-8">
              <button
                onClick={() => fetchSongs(true)}
                disabled={loading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Loading...' : 'Load More'}
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

