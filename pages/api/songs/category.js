import { getCategoryMusic } from '../../../lib/musicApis';
import { getMoodRecommendations } from '../../../lib/aiRecommendations';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { category, limit = 30, mood } = req.query;

    if (!category) {
      return res.status(400).json({ error: 'Category is required' });
    }

    let songs = await getCategoryMusic(category, parseInt(limit));

    // Apply AI mood filter if provided
    if (mood) {
      songs = await getMoodRecommendations(songs, mood);
    }

    res.status(200).json({
      success: true,
      category,
      mood: mood || null,
      count: songs.length,
      songs,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Category API error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch category songs',
    });
  }
}

