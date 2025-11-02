import { getDiscoverFeed } from '../../../lib/musicApis';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { count = 15 } = req.query;
    const songs = await getDiscoverFeed(parseInt(count));

    res.status(200).json({
      success: true,
      count: songs.length,
      songs,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Discover API error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch songs',
    });
  }
}

