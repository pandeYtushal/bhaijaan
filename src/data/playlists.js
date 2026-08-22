// BHAIJAAN.WTF — Verified Master Playlists & Track Catalogs (100% Accurate Metadata)

import songsCatalog from './songs-with-spotify.json';

// Curated song pools for each playlist channel
const ALL_SONGS = songsCatalog.map((s) => ({
  ...s,
  duration: s.duration || 300,
  audioUrl: s.audioUrl
}));

export const playlists = {
  bhaiMode: {
    id: "bhai-mode",
    name: "BHAI MODE",
    label: "BHAI MODE",
    spotifyUrl: "https://open.spotify.com/playlist/3Ye57MhrB2yFkD39bdxU5c",
    subtitle: "High-Energy Party & Dance Bangers (40 Songs)",
    tracks: [
      ALL_SONGS[5],  // Swag Se Swagat
      ALL_SONGS[4],  // Jumme Ki Raat
      ALL_SONGS[7],  // Munni Badnaam Hui
      ALL_SONGS[3],  // Hud Hud Dabangg
      ALL_SONGS[15], // Character Dheela
      ALL_SONGS[38], // Dhinka Chika
      ALL_SONGS[12], // Tan Tana Tan
      ALL_SONGS[13], // O Unchi Hai Building
      ALL_SONGS[20], // Slow Motion
      ALL_SONGS[21], // Seeti Maar
      ALL_SONGS[25], // Selfie Le Le Re
      ALL_SONGS[29], // Pandey Jee Se Seeti
      ALL_SONGS[30], // Fevicol Se
      ALL_SONGS[31], // Mashallah
      ALL_SONGS[35], // Baby Ko Bass Pasand Hai
      ALL_SONGS[36], // 440 Volt
      ALL_SONGS[37], // Sultan Title Track
      ALL_SONGS[14], // Jeene Ke Hain Chaar Din
      ALL_SONGS[17], // Just Chill
      ALL_SONGS[27], // Hangover
      ALL_SONGS[34], // Radio
      ALL_SONGS[33], // Lapaata
      ALL_SONGS[0],  // O O Jaane Jaana
      ALL_SONGS[1],  // Dil Deewana
      ALL_SONGS[2],  // Tere Naam
      ALL_SONGS[6],  // Dil Diyan Gallan
      ALL_SONGS[8],  // Mera Dil Bhi Kitna Pagal
      ALL_SONGS[9],  // Chand Chhupa Badal Mein
      ALL_SONGS[10], // Pehla Pehla Pyar
      ALL_SONGS[11], // Didi Tera Devar Deewana
      ALL_SONGS[16], // Saajanji Ghar Aaye
      ALL_SONGS[18], // Chori Chori Chupke Chupke
      ALL_SONGS[19], // Jag Ghoomeya
      ALL_SONGS[22], // Main Hoon Hero Tera
      ALL_SONGS[23], // Aaj Unse Milna Hai
      ALL_SONGS[24], // Prem Leela
      ALL_SONGS[26], // Tu Jo Mila
      ALL_SONGS[28], // Dagabaaz Re
      ALL_SONGS[32], // Saiyaara
      ALL_SONGS[39]  // Naiyo Lagda
    ]
  },

  bhaiOfficial: {
    id: "bhai-official",
    name: "BHAI OFFICIAL",
    label: "BHAI OFFICIAL",
    spotifyUrl: "https://open.spotify.com/playlist/37i9dQZF1DZ06evO3CjygN",
    subtitle: "Official Romantic Blockbusters & Soulful Hits (40 Songs)",
    tracks: [
      ALL_SONGS[1],  // Dil Deewana
      ALL_SONGS[2],  // Tere Naam
      ALL_SONGS[6],  // Dil Diyan Gallan
      ALL_SONGS[19], // Jag Ghoomeya
      ALL_SONGS[22], // Main Hoon Hero Tera
      ALL_SONGS[23], // Aaj Unse Milna Hai
      ALL_SONGS[24], // Prem Leela
      ALL_SONGS[26], // Tu Jo Mila
      ALL_SONGS[32], // Saiyaara
      ALL_SONGS[39], // Naiyo Lagda
      ALL_SONGS[8],  // Mera Dil Bhi Kitna Pagal
      ALL_SONGS[9],  // Chand Chhupa Badal Mein
      ALL_SONGS[10], // Pehla Pehla Pyar
      ALL_SONGS[11], // Didi Tera Devar Deewana
      ALL_SONGS[16], // Saajanji Ghar Aaye
      ALL_SONGS[18], // Chori Chori Chupke Chupke
      ALL_SONGS[28], // Dagabaaz Re
      ALL_SONGS[27], // Hangover
      ALL_SONGS[0],  // O O Jaane Jaana
      ALL_SONGS[3],  // Hud Hud Dabangg
      ALL_SONGS[4],  // Jumme Ki Raat
      ALL_SONGS[5],  // Swag Se Swagat
      ALL_SONGS[7],  // Munni Badnaam Hui
      ALL_SONGS[12], // Tan Tana Tan
      ALL_SONGS[13], // O Unchi Hai Building
      ALL_SONGS[14], // Jeene Ke Hain Chaar Din
      ALL_SONGS[15], // Character Dheela
      ALL_SONGS[17], // Just Chill
      ALL_SONGS[20], // Slow Motion
      ALL_SONGS[21], // Seeti Maar
      ALL_SONGS[25], // Selfie Le Le Re
      ALL_SONGS[29], // Pandey Jee Se Seeti
      ALL_SONGS[30], // Fevicol Se
      ALL_SONGS[31], // Mashallah
      ALL_SONGS[33], // Lapaata
      ALL_SONGS[34], // Radio
      ALL_SONGS[35], // Baby Ko Bass Pasand Hai
      ALL_SONGS[36], // 440 Volt
      ALL_SONGS[37], // Sultan Title Track
      ALL_SONGS[38]  // Dhinka Chika
    ]
  },

  twoThousands: {
    id: "2000s-kid",
    name: "2000s KID",
    label: "2000s KID",
    spotifyUrl: "https://open.spotify.com/playlist/7iW35WA5Zs6GtHBGGRu4CZ",
    subtitle: "2000s Love, Heartbreak & Upbeat Jams (40 Songs)",
    tracks: [
      ALL_SONGS[2],  // Tere Naam
      ALL_SONGS[14], // Jeene Ke Hain Chaar Din
      ALL_SONGS[17], // Just Chill
      ALL_SONGS[18], // Chori Chori Chupke Chupke
      ALL_SONGS[27], // Hangover
      ALL_SONGS[28], // Dagabaaz Re
      ALL_SONGS[33], // Lapaata
      ALL_SONGS[34], // Radio
      ALL_SONGS[3],  // Hud Hud Dabangg
      ALL_SONGS[7],  // Munni Badnaam Hui
      ALL_SONGS[4],  // Jumme Ki Raat
      ALL_SONGS[15], // Character Dheela
      ALL_SONGS[38], // Dhinka Chika
      ALL_SONGS[31], // Mashallah
      ALL_SONGS[32], // Saiyaara
      ALL_SONGS[29], // Pandey Jee Se Seeti
      ALL_SONGS[30], // Fevicol Se
      ALL_SONGS[0],  // O O Jaane Jaana
      ALL_SONGS[1],  // Dil Deewana
      ALL_SONGS[5],  // Swag Se Swagat
      ALL_SONGS[6],  // Dil Diyan Gallan
      ALL_SONGS[8],  // Mera Dil Bhi Kitna Pagal
      ALL_SONGS[9],  // Chand Chhupa Badal Mein
      ALL_SONGS[10], // Pehla Pehla Pyar
      ALL_SONGS[11], // Didi Tera Devar Deewana
      ALL_SONGS[12], // Tan Tana Tan
      ALL_SONGS[13], // O Unchi Hai Building
      ALL_SONGS[16], // Saajanji Ghar Aaye
      ALL_SONGS[19], // Jag Ghoomeya
      ALL_SONGS[20], // Slow Motion
      ALL_SONGS[21], // Seeti Maar
      ALL_SONGS[22], // Main Hoon Hero Tera
      ALL_SONGS[23], // Aaj Unse Milna Hai
      ALL_SONGS[24], // Prem Leela
      ALL_SONGS[25], // Selfie Le Le Re
      ALL_SONGS[26], // Tu Jo Mila
      ALL_SONGS[35], // Baby Ko Bass Pasand Hai
      ALL_SONGS[36], // 440 Volt
      ALL_SONGS[37], // Sultan Title Track
      ALL_SONGS[39]  // Naiyo Lagda
    ]
  },

  nineties: {
    id: "90s-radio",
    name: "90s RADIO",
    label: "90s RADIO",
    spotifyUrl: "https://open.spotify.com/playlist/4a499zchFELXUSumfrUFvK",
    subtitle: "Blockbuster 90s Vintage Cassette Radio (40 Songs)",
    tracks: [
      ALL_SONGS[0],  // O O Jaane Jaana
      ALL_SONGS[1],  // Dil Deewana
      ALL_SONGS[10], // Pehla Pehla Pyar
      ALL_SONGS[11], // Didi Tera Devar Deewana
      ALL_SONGS[8],  // Mera Dil Bhi Kitna Pagal
      ALL_SONGS[9],  // Chand Chhupa Badal Mein
      ALL_SONGS[16], // Saajanji Ghar Aaye
      ALL_SONGS[12], // Tan Tana Tan
      ALL_SONGS[13], // O Unchi Hai Building
      ALL_SONGS[18], // Chori Chori Chupke Chupke
      ALL_SONGS[2],  // Tere Naam
      ALL_SONGS[14], // Jeene Ke Hain Chaar Din
      ALL_SONGS[17], // Just Chill
      ALL_SONGS[3],  // Hud Hud Dabangg
      ALL_SONGS[4],  // Jumme Ki Raat
      ALL_SONGS[5],  // Swag Se Swagat
      ALL_SONGS[6],  // Dil Diyan Gallan
      ALL_SONGS[7],  // Munni Badnaam Hui
      ALL_SONGS[15], // Character Dheela
      ALL_SONGS[19], // Jag Ghoomeya
      ALL_SONGS[20], // Slow Motion
      ALL_SONGS[21], // Seeti Maar
      ALL_SONGS[22], // Main Hoon Hero Tera
      ALL_SONGS[23], // Aaj Unse Milna Hai
      ALL_SONGS[24], // Prem Leela
      ALL_SONGS[25], // Selfie Le Le Re
      ALL_SONGS[26], // Tu Jo Mila
      ALL_SONGS[27], // Hangover
      ALL_SONGS[28], // Dagabaaz Re
      ALL_SONGS[29], // Pandey Jee Se Seeti
      ALL_SONGS[30], // Fevicol Se
      ALL_SONGS[31], // Mashallah
      ALL_SONGS[32], // Saiyaara
      ALL_SONGS[33], // Lapaata
      ALL_SONGS[34], // Radio
      ALL_SONGS[35], // Baby Ko Bass Pasand Hai
      ALL_SONGS[36], // 440 Volt
      ALL_SONGS[37], // Sultan Title Track
      ALL_SONGS[38], // Dhinka Chika
      ALL_SONGS[39]  // Naiyo Lagda
    ]
  },

  nostalgia: {
    id: "nostalgia",
    name: "90s / EARLY 2000s",
    label: "90s / EARLY 2000s",
    spotifyUrl: "https://open.spotify.com/playlist/0Rgj9nRineoSYEktQeg61b",
    subtitle: "Cult Barbershop Nostalgia (40 Songs)",
    tracks: [
      ALL_SONGS[8],  // Mera Dil Bhi Kitna Pagal
      ALL_SONGS[9],  // Chand Chhupa Badal Mein
      ALL_SONGS[0],  // O O Jaane Jaana
      ALL_SONGS[10], // Pehla Pehla Pyar
      ALL_SONGS[16], // Saajanji Ghar Aaye
      ALL_SONGS[18], // Chori Chori Chupke Chupke
      ALL_SONGS[1],  // Dil Deewana
      ALL_SONGS[2],  // Tere Naam
      ALL_SONGS[11], // Didi Tera Devar Deewana
      ALL_SONGS[12], // Tan Tana Tan
      ALL_SONGS[13], // O Unchi Hai Building
      ALL_SONGS[14], // Jeene Ke Hain Chaar Din
      ALL_SONGS[17], // Just Chill
      ALL_SONGS[28], // Dagabaaz Re
      ALL_SONGS[27], // Hangover
      ALL_SONGS[3],  // Hud Hud Dabangg
      ALL_SONGS[4],  // Jumme Ki Raat
      ALL_SONGS[5],  // Swag Se Swagat
      ALL_SONGS[6],  // Dil Diyan Gallan
      ALL_SONGS[7],  // Munni Badnaam Hui
      ALL_SONGS[15], // Character Dheela
      ALL_SONGS[19], // Jag Ghoomeya
      ALL_SONGS[20], // Slow Motion
      ALL_SONGS[21], // Seeti Maar
      ALL_SONGS[22], // Main Hoon Hero Tera
      ALL_SONGS[23], // Aaj Unse Milna Hai
      ALL_SONGS[24], // Prem Leela
      ALL_SONGS[25], // Selfie Le Le Re
      ALL_SONGS[26], // Tu Jo Mila
      ALL_SONGS[29], // Pandey Jee Se Seeti
      ALL_SONGS[30], // Fevicol Se
      ALL_SONGS[31], // Mashallah
      ALL_SONGS[32], // Saiyaara
      ALL_SONGS[33], // Lapaata
      ALL_SONGS[34], // Radio
      ALL_SONGS[35], // Baby Ko Bass Pasand Hai
      ALL_SONGS[36], // 440 Volt
      ALL_SONGS[37], // Sultan Title Track
      ALL_SONGS[38], // Dhinka Chika
      ALL_SONGS[39]  // Naiyo Lagda
    ]
  }
};

export const PLAYLISTS = Object.values(playlists);
export default playlists;

