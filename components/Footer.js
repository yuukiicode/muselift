'use client';

import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-white/10 py-8">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-400"
        >
          Made with ❤️ by <span className="gradient-text font-semibold">MuseLift</span>
        </motion.p>
        <p className="text-sm text-gray-500 mt-2">
          Inspire. Listen. Master.
        </p>
      </div>
    </footer>
  );
}

