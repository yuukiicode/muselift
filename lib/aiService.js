import axios from 'axios';

const HF_API_KEY = process.env.HUGGINGFACE_API_KEY || '';
const HF_INFERENCE_URL = 'https://api-inference.huggingface.co/models/';

// Using free sentence-transformers model for embeddings
const EMBEDDING_MODEL = 'sentence-transformers/all-MiniLM-L6-v2';

// Simple text similarity without API (fallback)
function simpleTextSimilarity(text1, text2) {
  const words1 = text1.toLowerCase().split(/\s+/);
  const words2 = text2.toLowerCase().split(/\s+/);
  
  const intersection = words1.filter(word => words2.includes(word));
  const union = new Set([...words1, ...words2]);
  
  return intersection.length / union.size;
}

// AI-powered filtering (optional - falls back to keyword matching)
export async function filterSongsByMood(songs, mood) {
  if (!HF_API_KEY) {
    // Fallback: keyword-based filtering
    const moodKeywords = {
      'Chill': ['chill', 'relax', 'calm', 'ambient', 'lo-fi', 'peaceful'],
      'Energetic': ['energy', 'upbeat', 'dance', 'rock', 'metal', 'pump'],
      'Emotional': ['emotion', 'soul', 'ballad', 'sad', 'moving', 'touching'],
      'Devotional': ['devotional', 'spiritual', 'bhajan', 'hymn', 'prayer'],
      'Uplifting': ['happy', 'joy', 'uplifting', 'positive', 'bright'],
      'Melancholic': ['melancholy', 'sad', 'blues', 'somber', 'moody'],
      'Peaceful': ['peace', 'calm', 'serene', 'quiet', 'meditation'],
      'Intense': ['intense', 'powerful', 'dramatic', 'epic', 'heavy'],
      'Groovy': ['groove', 'funk', 'rhythm', 'dance', 'beat']
    };

    const keywords = moodKeywords[mood] || [];
    
    return songs.filter(song => {
      const text = `${song.title} ${song.artist} ${song.genre}`.toLowerCase();
      return keywords.some(keyword => text.includes(keyword));
    });
  }

  // If API key is available, use HuggingFace
  try {
    const moodDescription = `${mood} music that makes you feel ${mood.toLowerCase()}`;
    
    const songsWithScores = await Promise.all(
      songs.map(async (song) => {
        const songText = `${song.title} by ${song.artist} - ${song.genre}`;
        const score = simpleTextSimilarity(songText, moodDescription);
        return { ...song, score };
      })
    );

    return songsWithScores
      .sort((a, b) => b.score - a.score)
      .slice(0, Math.min(songs.length, 10));
  } catch (error) {
    console.error('AI filtering error:', error);
    return songs;
  }
}

// Semantic search for similar artists/songs
export async function findSimilarContent(query, items, topK = 10) {
  try {
    const scores = items.map(item => {
      const itemText = `${item.title || item.name} ${item.artist || ''} ${item.genre || ''}`;
      return {
        ...item,
        similarity: simpleTextSimilarity(query, itemText)
      };
    });

    return scores
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK);
  } catch (error) {
    console.error('Similarity search error:', error);
    return items.slice(0, topK);
  }
}

