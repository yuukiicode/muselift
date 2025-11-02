import { getLegendaryArtists } from '../../../lib/musicApis';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { category = 'all' } = req.query;
    const artists = await getLegendaryArtists(category);

    res.status(200).json({
      success: true,
      category,
      count: artists.length,
      artists,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Artists API error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch artists',
    });
  }
}

