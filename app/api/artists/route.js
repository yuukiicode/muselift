import { NextResponse } from 'next/server';
import { LEGENDARY_ARTISTS } from '@/lib/constants';
import { searchSongsByArtist } from '@/lib/musicApis';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');

    if (name) {
      // Get specific artist with their songs
      const artist = LEGENDARY_ARTISTS.find(
        (a) => a.name.toLowerCase() === name.toLowerCase()
      );

      if (!artist) {
        return NextResponse.json({ error: 'Artist not found' }, { status: 404 });
      }

      const songs = await searchSongsByArtist(artist.name, 10);
      return NextResponse.json({ artist, songs });
    }

    // Return all artists
    return NextResponse.json({ artists: LEGENDARY_ARTISTS });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch artists', details: error.message },
      { status: 500 }
    );
  }
}
