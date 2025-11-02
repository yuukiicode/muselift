import '../styles/globals.css';
import Layout from '../components/Layout';
import { AnimatePresence } from 'framer-motion';

export default function App({ Component, pageProps, router }) {
  return (
    <Layout>
      <AnimatePresence mode="wait" initial={false}>
        <Component {...pageProps} key={router.pathname} />
      </AnimatePresence>
    </Layout>
  );
}

