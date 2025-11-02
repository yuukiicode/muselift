
import axios from 'axios';

const LASTFM_API_KEY = process.env.LASTFM_API_KEY || '7f396b8906c1f8dc1e8a6fcad84547dd'; // Demo key
const LASTFM_BASE = 'https://ws.audioscrobbler.com/2.0/';

// Cache to prevent duplicate API calls
const cache = new Map();
const CACHE_DURATION = 1000 * 60 * 10; // 10 minutes

function getCached(key) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
}

function setCache(key, data) {
  cache.set(key, { data, timestamp: Date.now() });
}

// Shuffle array utility
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Last.fm API calls
export async function searchSongsByGenre(genre, limit = 20) {
  const cacheKey = `genre_${genre}_${limit}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const response = await axios.get(LASTFM_BASE, {
      params: {
        method: 'tag.gettoptracks',
        tag: genre,
        api_key: LASTFM_API_KEY,
        format: 'json',
        limit: limit * 2 // Get more to filter
      }
    });

    const tracks = response.data?.tracks?.track || [];
    const formatted = tracks.map(track => ({
      title: track.name,
      artist: track.artist?.name || 'Unknown Artist',
      genre: genre,
      language: 'English',
      url: track.url,
      image: track.image?.[2]?.['#text'] || '',
      source: 'Last.fm'
    }));

    const shuffled = shuffleArray(formatted).slice(0, limit);
    setCache(cacheKey, shuffled);
    return shuffled;
  } catch (error) {
    console.error('Last.fm API error:', error.message);
    return [];
  }
}

export async function searchSongsByArtist(artistName, limit = 10) {
  const cacheKey = `artist_${artistName}_${limit}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const response = await axios.get(LASTFM_BASE, {
      params: {
        method: 'artist.gettoptracks',
        artist: artistName,
        api_key: LASTFM_API_KEY,
        format: 'json',
        limit
      }
    });

    const tracks = response.data?.toptracks?.track || [];
    const formatted = tracks.map(track => ({
      title: track.name,
      artist: artistName,
      genre: 'Various',
      url: track.url,
      image: track.image?.[2]?.['#text'] || '',
      source: 'Last.fm'
    }));

    setCache(cacheKey, formatted);
    return formatted;
  } catch (error) {
    console.error('Artist search error:', error.message);
    return [];
  }
}

export async function getSimilarTracks(artist, track, limit = 10) {
  try {
    const response = await axios.get(LASTFM_BASE, {
      params: {
        method: 'track.getsimilar',
        artist,
        track,
        api_key: LASTFM_API_KEY,
        format: 'json',
        limit
      }
    });

    const tracks = response.data?.similartracks?.track || [];
    return tracks.map(t => ({
      title: t.name,
      artist: t.artist?.name || 'Unknown',
      url: t.url,
      image: t.image?.[2]?.['#text'] || '',
      source: 'Last.fm'
    }));
  } catch (error) {
    console.error('Similar tracks error:', error.message);
    return [];
  }
}

// MusicBrainz API
export async function searchMusicBrainz(query, limit = 10) {
  try {
    const response = await axios.get('https://musicbrainz.org/ws/2/recording', {
      params: {
        query,
        limit,
        fmt: 'json'
      },
      headers: {
        'User-Agent': 'MuseLift/1.0.0 (contact@muselift.app)'
      }
    });

    const recordings = response.data?.recordings || [];
    return recordings.map(rec => ({
      title: rec.title,
      artist: rec['artist-credit']?.[0]?.name || 'Unknown',
      genre: rec.tags?.[0]?.name || 'Various',
      mbid: rec.id,
      source: 'MusicBrainz'
    }));
  } catch (error) {
    console.error('MusicBrainz error:', error.message);
    return [];
  }
}

// iTunes Search API
export async function searchiTunes(term, limit = 20) {
  const cacheKey = `itunes_${term}_${limit}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const response = await axios.get('https://itunes.apple.com/search', {
      params: {
        term,
        media: 'music',
        entity: 'song',
        limit: limit * 2
      }
    });

    const results = response.data?.results || [];
    const formatted = results.map(item => ({
      title: item.trackName,
      artist: item.artistName,
      genre: item.primaryGenreName,
      album: item.collectionName,
      url: item.trackViewUrl,
      preview: item.previewUrl,
      image: item.artworkUrl100,
      language: 'English',
      source: 'iTunes'
    }));

    const shuffled = shuffleArray(formatted).slice(0, limit);
    setCache(cacheKey, shuffled);
    return shuffled;
  } catch (error) {
    console.error('iTunes error:', error.message);
    return [];
  }
}

// Combine multiple sources for diverse results
export async function getRandomSongs(count = 15) {
  const genres = ['jazz', 'classical', 'rock', 'blues', 'folk', 'electronic'];
  const indianTerms = ['carnatic', 'hindi', 'rahman', 'fusion india', 'bollywood'];
  
  const randomGenre = genres[Math.floor(Math.random() * genres.length)];
  const randomIndian = indianTerms[Math.floor(Math.random() * indianTerms.length)];

  try {
    const [lastfmResults, itunesGlobal, itunesIndian] = await Promise.all([
      searchSongsByGenre(randomGenre, 5),
      searchiTunes(randomGenre, 5),
      searchiTunes(randomIndian, 5)
    ]);

    const combined = [...lastfmResults, ...itunesGlobal, ...itunesIndian];
    return shuffleArray(combined).slice(0, count);
  } catch (error) {
    console.error('Random songs error:', error);
    return [];
  }
}

// Indian music specific search (using iTunes + terms)
export async function searchIndianMusic(language, limit = 15) {
  const searchTerms = {
    'Hindi': 'bollywood hindi',
    'Malayalam': 'malayalam music',
    'Tamil': 'tamil music',
    'Telugu': 'telugu music',
    'Carnatic': 'carnatic classical',
    'Indian Fusion': 'indian fusion agam'
  };

  const term = searchTerms[language] || language;
  return searchiTunes(term, limit);
}
