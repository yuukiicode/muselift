import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass-card m-4 px-6 py-6 text-center"
    >
      <p className="text-gray-400">
        Made with <span className="text-red-500">❤️</span> by{' '}
        <span className="text-primary-400 font-semibold">MuseLift</span>
      </p>
      <p className="text-sm text-gray-500 mt-2">
        Discover • Inspire • Master
      </p>
    </motion.footer>
  );
}

