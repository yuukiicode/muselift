'use client';

import { motion } from 'framer-motion';
import Piano from '@/components/Piano';

export default function EarTrainingPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl font-bold mb-4 gradient-text">Ear Training</h1>
        <p className="text-xl text-gray-300">
          Develop your musical ear by identifying notes and intervals
        </p>
      </motion.div>

      <Piano />

      {/* Additional Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-12 glass-card p-8 max-w-3xl mx-auto"
      >
        <h2 className="text-2xl font-bold text-white mb-4">How It Works</h2>
        <div className="space-y-3 text-gray-300">
          <p>
            <strong className="text-primary-400">1. Choose your difficulty:</strong> Start with
            natural notes (Beginner), progress to all notes (Intermediate), or challenge yourself
            with chords (Advanced).
          </p>
          <p>
            <strong className="text-primary-400">2. Click "Play Note":</strong> Listen carefully to
            the note that plays.
          </p>
          <p>
            <strong className="text-primary-400">3. Identify the note:</strong> Click the piano key
            you think matches the played note.
          </p>
          <p>
            <strong className="text-primary-400">4. Build your streak:</strong> Consecutive correct
            answers increase your streak and score!
          </p>
        </div>

        <div className="mt-6 p-4 rounded-lg bg-primary-500/10 border border-primary-500/20">
          <p className="text-sm text-gray-400">
            <strong className="text-primary-400">Pro Tip:</strong> Practice daily for 10-15 minutes
            to significantly improve your relative pitch recognition!
          </p>
        </div>
      </motion.div>
    </div>
  );
}

