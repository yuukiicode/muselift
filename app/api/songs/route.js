import { NextResponse } from 'next/server';
import {
  getRandomSongs,
  searchSongsByGenre,
  searchIndianMusic,
  searchiTunes
} from '@/lib/musicApis';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const genre = searchParams.get('genre');
    const language = searchParams.get('language');
    const count = parseInt(searchParams.get('count') || '15');

    let songs = [];

    if (genre) {
      // Fetch by genre
      songs = await searchSongsByGenre(genre.toLowerCase(), count);
    } else if (language) {
      // Fetch by language (Indian music)
      songs = await searchIndianMusic(language, count);
    } else {
      // Random mixed selection
      songs = await getRandomSongs(count);
    }

    return NextResponse.json({ songs, count: songs.length });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch songs', details: error.message },
      { status: 500 }
    );
  }
}
