import { NextResponse } from 'next/server';
import { filterSongsByMood, findSimilarContent } from '@/lib/aiService';
import { getRandomSongs } from '@/lib/musicApis';

export async function POST(request) {
  try {
    const body = await request.json();
    const { mood, query, songs: providedSongs } = body;

    let songs = providedSongs;

    // If no songs provided, fetch random ones
    if (!songs || songs.length === 0) {
      songs = await getRandomSongs(30);
    }

    if (mood) {
      // Filter by mood
      const filtered = await filterSongsByMood(songs, mood);
      return NextResponse.json({ songs: filtered, mood });
    }

    if (query) {
      // Find similar content
      const similar = await findSimilarContent(query, songs, 15);
      return NextResponse.json({ songs: similar, query });
    }

    return NextResponse.json({ error: 'No mood or query provided' }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { error: 'AI recommendation failed', details: error.message },
      { status: 500 }
    );
  }
}
