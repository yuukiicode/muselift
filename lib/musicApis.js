import axios from 'axios';
import { shuffleArray, getRandomItems, CacheManager } from './shuffle';

const cache = new CacheManager();

// Last.fm API configuration
const LASTFM_API_KEY = process.env.LASTFM_API_KEY || 'YOUR_API_KEY_HERE';
const LASTFM_BASE_URL = 'https://ws.audioscrobbler.com/2.0/';

// MusicBrainz API configuration
const MUSICBRAINZ_BASE_URL = 'https://musicbrainz.org/ws/2/';

// iTunes API configuration
const ITUNES_BASE_URL = 'https://itunes.apple.com/search';

/**
 * Fetch songs from Last.fm by tag/genre
 */
export async function fetchLastFmByTag(tag, limit = 50) {
  const cacheKey = `lastfm_${tag}_${limit}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  try {
    const response = await axios.get(LASTFM_BASE_URL, {
      params: {
        method: 'tag.gettoptracks',
        tag,
        api_key: LASTFM_API_KEY,
        format: 'json',
        limit,
      },
    });

    const tracks = response.data.tracks?.track || [];
    const formatted = tracks.map(track => ({
      title: track.name,
      artist: track.artist?.name || 'Unknown Artist',
      genre: tag,
      language: 'English',
      url: track.url,
      image: track.image?.[3]?.['#text'] || '',
      source: 'Last.fm',
    }));

    cache.set(cacheKey, formatted);
    return formatted;
  } catch (error) {
    console.error('Last.fm API error:', error.message);
    return [];
  }
}

/**
 * Fetch songs from iTunes by genre and region
 */
export async function fetchITunesByGenre(genre, region = 'us', limit = 50) {
  const cacheKey = `itunes_${genre}_${region}_${limit}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  try {
    const response = await axios.get(ITUNES_BASE_URL, {
      params: {
        term: genre,
        country: region,
        media: 'music',
        entity: 'song',
        limit,
      },
    });

    const tracks = response.data.results || [];
    const formatted = tracks.map(track => ({
      title: track.trackName,
      artist: track.artistName,
      genre: track.primaryGenreName || genre,
      language: region === 'in' ? 'Hindi' : 'English',
      url: track.trackViewUrl,
      previewUrl: track.previewUrl,
      image: track.artworkUrl100?.replace('100x100', '500x500') || '',
      source: 'iTunes',
    }));

    cache.set(cacheKey, formatted);
    return formatted;
  } catch (error) {
    console.error('iTunes API error:', error.message);
    return [];
  }
}

/**
 * Fetch Indian music from iTunes
 */
export async function fetchIndianMusic(language, limit = 30) {
  const searchTerms = {
    hindi: ['bollywood', 'hindi songs', 'arijit singh', 'shreya ghoshal'],
    malayalam: ['malayalam songs', 'vineeth sreenivasan', 'sithara krishnakumar'],
    tamil: ['tamil songs', 'anirudh', 'sid sriram'],
    telugu: ['telugu songs', 'devi sri prasad', 'armaan malik'],
    carnatic: ['carnatic music', 'carnatic vocal', 'MS Subbulakshmi'],
    fusion: ['indian fusion', 'agam band', 'thaikkudam bridge', 'avial'],
  };

  const terms = searchTerms[language.toLowerCase()] || [language];
  const allTracks = [];

  for (const term of terms) {
    const tracks = await fetchITunesByGenre(term, 'in', Math.ceil(limit / terms.length));
    allTracks.push(...tracks);
  }

  return shuffleArray(allTracks).slice(0, limit);
}

/**
 * Fetch artists from Last.fm by tag
 */
export async function fetchArtistsByTag(tag, limit = 30) {
  const cacheKey = `artists_${tag}_${limit}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  try {
    const response = await axios.get(LASTFM_BASE_URL, {
      params: {
        method: 'tag.gettopartists',
        tag,
        api_key: LASTFM_API_KEY,
        format: 'json',
        limit,
      },
    });

    const artists = response.data.topartists?.artist || [];
    const formatted = await Promise.all(
      artists.slice(0, limit).map(async artist => {
        const bio = await fetchArtistBio(artist.name);
        return {
          name: artist.name,
          genre: tag,
          url: artist.url,
          image: artist.image?.[3]?.['#text'] || '',
          bio: bio || 'Influential artist in the music industry.',
          source: 'Last.fm',
        };
      })
    );

    cache.set(cacheKey, formatted);
    return formatted;
  } catch (error) {
    console.error('Artist fetch error:', error.message);
    return [];
  }
}

/**
 * Fetch artist biography from Last.fm
 */
async function fetchArtistBio(artistName) {
  try {
    const response = await axios.get(LASTFM_BASE_URL, {
      params: {
        method: 'artist.getinfo',
        artist: artistName,
        api_key: LASTFM_API_KEY,
        format: 'json',
      },
    });

    const bio = response.data.artist?.bio?.summary || '';
    return bio.split('<a')[0].trim(); // Remove "Read more" link
  } catch (error) {
    return '';
  }
}

/**
 * Master function to get diverse music recommendations
 */
export async function getDiscoverFeed(count = 15) {
  const genres = ['jazz', 'rock', 'classical', 'pop', 'blues', 'funk', 'metal', 'folk', 'lofi', 'alternative'];
  const indianGenres = ['hindi', 'malayalam', 'tamil', 'carnatic', 'fusion'];
  
  // Fetch global music
  const globalPromises = genres.map(genre => fetchLastFmByTag(genre, 5));
  const globalResults = await Promise.all(globalPromises);
  const globalTracks = globalResults.flat();

  // Fetch Indian music
  const indianPromises = indianGenres.map(lang => fetchIndianMusic(lang, 3));
  const indianResults = await Promise.all(indianPromises);
  const indianTracks = indianResults.flat();

  // Combine and shuffle
  const allTracks = [...globalTracks, ...indianTracks];
  return getRandomItems(allTracks, count);
}

/**
 * Get category-specific music
 */
export async function getCategoryMusic(category, limit = 30) {
  const categoryMap = {
    jazz: () => fetchLastFmByTag('jazz', limit),
    classical: () => fetchLastFmByTag('classical', limit),
    rock: () => fetchLastFmByTag('rock', limit),
    pop: () => fetchLastFmByTag('pop', limit),
    lofi: () => fetchLastFmByTag('lofi', limit),
    blues: () => fetchLastFmByTag('blues', limit),
    funk: () => fetchLastFmByTag('funk', limit),
    metal: () => fetchLastFmByTag('metal', limit),
    folk: () => fetchLastFmByTag('folk', limit),
    fusion: () => fetchLastFmByTag('fusion', limit),
    alternative: () => fetchLastFmByTag('alternative', limit),
    atmospheric: () => fetchLastFmByTag('ambient', limit),
    cozy: () => fetchLastFmByTag('chill', limit),
    hindi: () => fetchIndianMusic('hindi', limit),
    malayalam: () => fetchIndianMusic('malayalam', limit),
    tamil: () => fetchIndianMusic('tamil', limit),
    telugu: () => fetchIndianMusic('telugu', limit),
    carnatic: () => fetchIndianMusic('carnatic', limit),
    'indian-fusion': () => fetchIndianMusic('fusion', limit),
  };

  const fetchFunction = categoryMap[category.toLowerCase()];
  if (!fetchFunction) return [];

  const tracks = await fetchFunction();
  return shuffleArray(tracks);
}

/**
 * Get legendary artists by category
 */
export async function getLegendaryArtists(category = 'all') {
  const artistCategories = {
    vocalists: ['adele', 'freddie mercury', 'whitney houston', 'frank sinatra'],
    guitarists: ['jimi hendrix', 'eric clapton', 'slash', 'john mayer'],
    drummers: ['neil peart', 'buddy rich', 'john bonham', 'dave grohl'],
    bassists: ['flea', 'paul mccartney', 'jaco pastorius', 'geddy lee'],
    pianists: ['beethoven', 'chopin', 'herbie hancock', 'keith jarrett'],
    bands: ['the beatles', 'led zeppelin', 'pink floyd', 'radiohead'],
    indian: ['a r rahman', 'ilaiyaraaja', 'lata mangeshkar', 'zakir hussain', 'pt ravi shankar'],
  };

  const tags = category === 'all' 
    ? Object.values(artistCategories).flat()
    : artistCategories[category] || [];

  const artistPromises = tags.map(tag => fetchArtistsByTag(tag, 3));
  const results = await Promise.all(artistPromises);
  const allArtists = results.flat();

  return shuffleArray(allArtists).slice(0, 20);
}

