import { rankSongsByPrompt } from '../../../lib/aiRecommendations';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { songs, prompt } = req.body;

    if (!songs || !prompt) {
      return res.status(400).json({ error: 'Songs and prompt are required' });
    }

    const rankedSongs = await rankSongsByPrompt(songs, prompt);

    res.status(200).json({
      success: true,
      prompt,
      count: rankedSongs.length,
      songs: rankedSongs,
    });
  } catch (error) {
    console.error('AI recommend error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate AI recommendations',
    });
  }
}
