import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

export default function Navbar() {
  const router = useRouter();

  const links = [
    { href: '/', label: 'Home' },
    { href: '/categories', label: 'Categories' },
    { href: '/artists', label: 'Artists' },
    { href: '/ear-training', label: 'Ear Training' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="glass-card m-4 px-6 py-4 sticky top-4 z-50"
    >
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">
          MuseLift
        </Link>

        <div className="hidden md:flex space-x-6">
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-lg transition-colors ${
                router.pathname === link.href
                  ? 'text-primary-400 font-semibold'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile menu */}
        <div className="md:hidden">
          <select
            value={router.pathname}
            onChange={(e) => router.push(e.target.value)}
            className="bg-dark-800 text-white px-4 py-2 rounded-lg border border-white border-opacity-20"
          >
            {links.map(link => (
              <option key={link.href} value={link.href}>
                {link.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </motion.nav>
  );
}

