import axios from 'axios';

const HUGGINGFACE_API_URL = 'https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2';
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY || '';

/**
 * Generate text embeddings using HuggingFace free inference API
 */
async function generateEmbedding(text) {
  if (!HUGGINGFACE_API_KEY) {
    console.warn('HuggingFace API key not provided. Skipping AI recommendations.');
    return null;
  }

  try {
    const response = await axios.post(
      HUGGINGFACE_API_URL,
      { inputs: text },
      {
        headers: {
          'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('HuggingFace API error:', error.message);
    return null;
  }
}

/**
 * Calculate cosine similarity between two vectors
 */
function cosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;

  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));

  return dotProduct / (magnitudeA * magnitudeB);
}

/**
 * AI-powered song ranking based on prompt similarity
 */
export async function rankSongsByPrompt(songs, prompt) {
  if (!HUGGINGFACE_API_KEY || songs.length === 0) {
    return songs;
  }

  try {
    // Generate embedding for the prompt
    const promptEmbedding = await generateEmbedding(prompt);
    if (!promptEmbedding) return songs;

    // Generate embeddings for each song
    const songDescriptions = songs.map(song => 
      `${song.title} by ${song.artist} - ${song.genre} ${song.language}`
    );

    const songEmbeddings = await Promise.all(
      songDescriptions.map(desc => generateEmbedding(desc))
    );

    // Calculate similarity scores
    const rankedSongs = songs.map((song, index) => {
      const embedding = songEmbeddings[index];
      const similarity = embedding 
        ? cosineSimilarity(promptEmbedding, embedding)
        : 0;
      
      return { ...song, aiScore: similarity };
    });

    // Sort by similarity (descending)
    rankedSongs.sort((a, b) => b.aiScore - a.aiScore);

    return rankedSongs;
  } catch (error) {
    console.error('AI ranking error:', error.message);
    return songs;
  }
}

/**
 * Get AI-powered mood-based recommendations
 */
export async function getMoodRecommendations(songs, mood) {
  const moodPrompts = {
    chill: 'relaxing, calm, peaceful, ambient, lo-fi music for studying and relaxation',
    energetic: 'upbeat, fast-paced, powerful, exciting rock and electronic music',
    emotional: 'deep, touching, soulful, heartfelt ballads and acoustic songs',
    devotional: 'spiritual, meditative, classical Indian devotional music and mantras',
    fusion: 'innovative Indian fusion blending traditional and modern elements like Agam and Thaikkudam Bridge',
    atmospheric: 'cinematic, ethereal, ambient soundscapes and post-rock',
    happy: 'joyful, uplifting, cheerful pop and feel-good music',
    melancholic: 'sad, introspective, melancholic indie and alternative music',
  };

  const prompt = moodPrompts[mood.toLowerCase()] || mood;
  return await rankSongsByPrompt(songs, prompt);
}

