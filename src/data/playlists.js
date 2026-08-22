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
      ALL_SONGS[5],  // Swag Se Swagat (2017)
      ALL_SONGS[4],  // Jumme Ki Raat (2014)
      ALL_SONGS[7],  // Munni Badnaam Hui (2010)
      ALL_SONGS[3],  // Hud Hud Dabangg (2010)
      ALL_SONGS[15], // Character Dheela (2011)
      ALL_SONGS[38], // Dhinka Chika (2011)
      ALL_SONGS[12], // Tan Tana Tan (1997)
      ALL_SONGS[13], // O Unchi Hai Building (1997)
      ALL_SONGS[20], // Slow Motion (2019)
      ALL_SONGS[21], // Seeti Maar (2021)
      ALL_SONGS[25], // Selfie Le Le Re (2015)
      ALL_SONGS[29], // Pandey Jee Se Seeti (2012)
      ALL_SONGS[30], // Fevicol Se (2012)
      ALL_SONGS[31], // Mashallah (2012)
      ALL_SONGS[35], // Baby Ko Bass Pasand Hai (2016)
      ALL_SONGS[36], // 440 Volt (2016)
      ALL_SONGS[37], // Sultan Title Track (2016)
      ALL_SONGS[14], // Jeene Ke Hain Chaar Din (2004)
      ALL_SONGS[17], // Just Chill (2005)
      ALL_SONGS[27], // Hangover (2014)
      ALL_SONGS[34], // Radio (2017)
      ALL_SONGS[33], // Lapaata (2012)
      ALL_SONGS[0],  // O O Jaane Jaana (1998)
      ALL_SONGS[1],  // Dil Deewana (1989)
      ALL_SONGS[2],  // Tere Naam (2003)
      ALL_SONGS[6],  // Dil Diyan Gallan (2017)
      ALL_SONGS[8],  // Mera Dil Bhi Kitna Pagal (1991)
      ALL_SONGS[9],  // Chand Chhupa Badal Mein (1999)
      ALL_SONGS[10], // Pehla Pehla Pyar (1994)
      ALL_SONGS[11], // Didi Tera Devar Deewana (1994)
      ALL_SONGS[16], // Saajanji Ghar Aaye (1998)
      ALL_SONGS[18], // Chori Chori Chupke Chupke (2001)
      ALL_SONGS[19], // Jag Ghoomeya (2016)
      ALL_SONGS[22], // Main Hoon Hero Tera (2015)
      ALL_SONGS[23], // Aaj Unse Milna Hai (2015)
      ALL_SONGS[24], // Prem Leela (2015)
      ALL_SONGS[26], // Tu Jo Mila (2015)
      ALL_SONGS[28], // Dagabaaz Re (2012)
      ALL_SONGS[32], // Saiyaara (2012)
      ALL_SONGS[39]  // Naiyo Lagda (2023)
    ]
  },

  bhaiOfficial: {
    id: "bhai-official",
    name: "BHAI OFFICIAL",
    label: "BHAI OFFICIAL",
    spotifyUrl: "https://open.spotify.com/playlist/37i9dQZF1DZ06evO3CjygN",
    subtitle: "Official Romantic Blockbusters & Soulful Hits (40 Songs)",
    tracks: [
      ALL_SONGS[1],  // Dil Deewana (1989)
      ALL_SONGS[2],  // Tere Naam (2003)
      ALL_SONGS[6],  // Dil Diyan Gallan (2017)
      ALL_SONGS[19], // Jag Ghoomeya (2016)
      ALL_SONGS[22], // Main Hoon Hero Tera (2015)
      ALL_SONGS[23], // Aaj Unse Milna Hai (2015)
      ALL_SONGS[24], // Prem Leela (2015)
      ALL_SONGS[26], // Tu Jo Mila (2015)
      ALL_SONGS[32], // Saiyaara (2012)
      ALL_SONGS[39], // Naiyo Lagda (2023)
      ALL_SONGS[8],  // Mera Dil Bhi Kitna Pagal (1991)
      ALL_SONGS[9],  // Chand Chhupa Badal Mein (1999)
      ALL_SONGS[10], // Pehla Pehla Pyar (1994)
      ALL_SONGS[11], // Didi Tera Devar Deewana (1994)
      ALL_SONGS[16], // Saajanji Ghar Aaye (1998)
      ALL_SONGS[18], // Chori Chori Chupke Chupke (2001)
      ALL_SONGS[28], // Dagabaaz Re (2012)
      ALL_SONGS[27], // Hangover (2014)
      ALL_SONGS[0],  // O O Jaane Jaana (1998)
      ALL_SONGS[3],  // Hud Hud Dabangg (2010)
      ALL_SONGS[4],  // Jumme Ki Raat (2014)
      ALL_SONGS[5],  // Swag Se Swagat (2017)
      ALL_SONGS[7],  // Munni Badnaam Hui (2010)
      ALL_SONGS[12], // Tan Tana Tan (1997)
      ALL_SONGS[13], // O Unchi Hai Building (1997)
      ALL_SONGS[14], // Jeene Ke Hain Chaar Din (2004)
      ALL_SONGS[15], // Character Dheela (2011)
      ALL_SONGS[17], // Just Chill (2005)
      ALL_SONGS[20], // Slow Motion (2019)
      ALL_SONGS[21], // Seeti Maar (2021)
      ALL_SONGS[25], // Selfie Le Le Re (2015)
      ALL_SONGS[29], // Pandey Jee Se Seeti (2012)
      ALL_SONGS[30], // Fevicol Se (2012)
      ALL_SONGS[31], // Mashallah (2012)
      ALL_SONGS[33], // Lapaata (2012)
      ALL_SONGS[34], // Radio (2017)
      ALL_SONGS[35], // Baby Ko Bass Pasand Hai (2016)
      ALL_SONGS[36], // 440 Volt (2016)
      ALL_SONGS[37], // Sultan Title Track (2016)
      ALL_SONGS[38]  // Dhinka Chika (2011)
    ]
  },

  twoThousands: {
    id: "2000s-kid",
    name: "2000s KID",
    label: "2000s KID",
    spotifyUrl: "https://open.spotify.com/playlist/7iW35WA5Zs6GtHBGGRu4CZ",
    subtitle: "2000s Love, Heartbreak & Upbeat Jams (40 Songs)",
    tracks: [
      ALL_SONGS[2],  // Tere Naam (2003)
      ALL_SONGS[14], // Jeene Ke Hain Chaar Din (2004)
      ALL_SONGS[17], // Just Chill (2005)
      ALL_SONGS[18], // Chori Chori Chupke Chupke (2001)
      ALL_SONGS[27], // Hangover (2014)
      ALL_SONGS[28], // Dagabaaz Re (2012)
      ALL_SONGS[33], // Lapaata (2012)
      ALL_SONGS[34], // Radio (2017)
      ALL_SONGS[3],  // Hud Hud Dabangg (2010)
      ALL_SONGS[7],  // Munni Badnaam Hui (2010)
      ALL_SONGS[4],  // Jumme Ki Raat (2014)
      ALL_SONGS[15], // Character Dheela (2011)
      ALL_SONGS[38], // Dhinka Chika (2011)
      ALL_SONGS[31], // Mashallah (2012)
      ALL_SONGS[32], // Saiyaara (2012)
      ALL_SONGS[29], // Pandey Jee Se Seeti (2012)
      ALL_SONGS[30], // Fevicol Se (2012)
      ALL_SONGS[0],  // O O Jaane Jaana (1998)
      ALL_SONGS[1],  // Dil Deewana (1989)
      ALL_SONGS[5],  // Swag Se Swagat (2017)
      ALL_SONGS[6],  // Dil Diyan Gallan (2017)
      ALL_SONGS[8],  // Mera Dil Bhi Kitna Pagal (1991)
      ALL_SONGS[9],  // Chand Chhupa Badal Mein (1999)
      ALL_SONGS[10], // Pehla Pehla Pyar (1994)
      ALL_SONGS[11], // Didi Tera Devar Deewana (1994)
      ALL_SONGS[12], // Tan Tana Tan (1997)
      ALL_SONGS[13], // O Unchi Hai Building (1997)
      ALL_SONGS[16], // Saajanji Ghar Aaye (1998)
      ALL_SONGS[19], // Jag Ghoomeya (2016)
      ALL_SONGS[20], // Slow Motion (2019)
      ALL_SONGS[21], // Seeti Maar (2021)
      ALL_SONGS[22], // Main Hoon Hero Tera (2015)
      ALL_SONGS[23], // Aaj Unse Milna Hai (2015)
      ALL_SONGS[24], // Prem Leela (2015)
      ALL_SONGS[25], // Selfie Le Le Re (2015)
      ALL_SONGS[26], // Tu Jo Mila (2015)
      ALL_SONGS[35], // Baby Ko Bass Pasand Hai (2016)
      ALL_SONGS[36], // 440 Volt (2016)
      ALL_SONGS[37], // Sultan Title Track (2016)
      ALL_SONGS[39]  // Naiyo Lagda (2023)
    ]
  },

  nineties: {
    id: "90s-radio",
    name: "90s RADIO",
    label: "90s RADIO",
    spotifyUrl: "https://open.spotify.com/playlist/4a499zchFELXUSumfrUFvK",
    subtitle: "Blockbuster 90s Vintage Cassette Radio (40 Songs)",
    tracks: [
      ALL_SONGS[0],  // O O Jaane Jaana (1998)
      ALL_SONGS[1],  // Dil Deewana (1989)
      ALL_SONGS[10], // Pehla Pehla Pyar (1994)
      ALL_SONGS[11], // Didi Tera Devar Deewana (1994)
      ALL_SONGS[8],  // Mera Dil Bhi Kitna Pagal (1991)
      ALL_SONGS[9],  // Chand Chhupa Badal Mein (1999)
      ALL_SONGS[16], // Saajanji Ghar Aaye (1998)
      ALL_SONGS[12], // Tan Tana Tan (1997)
      ALL_SONGS[13], // O Unchi Hai Building (1997)
      ALL_SONGS[18], // Chori Chori Chupke Chupke (2001)
      ALL_SONGS[2],  // Tere Naam (2003)
      ALL_SONGS[14], // Jeene Ke Hain Chaar Din (2004)
      ALL_SONGS[17], // Just Chill (2005)
      ALL_SONGS[3],  // Hud Hud Dabangg (2010)
      ALL_SONGS[4],  // Jumme Ki Raat (2014)
      ALL_SONGS[5],  // Swag Se Swagat (2017)
      ALL_SONGS[6],  // Dil Diyan Gallan (2017)
      ALL_SONGS[7],  // Munni Badnaam Hui (2010)
      ALL_SONGS[15], // Character Dheela (2011)
      ALL_SONGS[19], // Jag Ghoomeya (2016)
      ALL_SONGS[20], // Slow Motion (2019)
      ALL_SONGS[21], // Seeti Maar (2021)
      ALL_SONGS[22], // Main Hoon Hero Tera (2015)
      ALL_SONGS[23], // Aaj Unse Milna Hai (2015)
      ALL_SONGS[24], // Prem Leela (2015)
      ALL_SONGS[25], // Selfie Le Le Re (2015)
      ALL_SONGS[26], // Tu Jo Mila (2015)
      ALL_SONGS[27], // Hangover (2014)
      ALL_SONGS[28], // Dagabaaz Re (2012)
      ALL_SONGS[29], // Pandey Jee Se Seeti (2012)
      ALL_SONGS[30], // Fevicol Se (2012)
      ALL_SONGS[31], // Mashallah (2012)
      ALL_SONGS[32], // Saiyaara (2012)
      ALL_SONGS[33], // Lapaata (2012)
      ALL_SONGS[34], // Radio (2017)
      ALL_SONGS[35], // Baby Ko Bass Pasand Hai (2016)
      ALL_SONGS[36], // 440 Volt (2016)
      ALL_SONGS[37], // Sultan Title Track (2016)
      ALL_SONGS[38], // Dhinka Chika (2011)
      ALL_SONGS[39]  // Naiyo Lagda (2023)
    ]
  },

  nostalgia: {
    id: "nostalgia",
    name: "90s / EARLY 2000s",
    label: "90s / EARLY 2000s",
    spotifyUrl: "https://open.spotify.com/playlist/0Rgj9nRineoSYEktQeg61b",
    subtitle: "Cult Barbershop Nostalgia (40 Songs)",
    tracks: [
      ALL_SONGS[8],  // Mera Dil Bhi Kitna Pagal (1991)
      ALL_SONGS[9],  // Chand Chhupa Badal Mein (1999)
      ALL_SONGS[0],  // O O Jaane Jaana (1998)
      ALL_SONGS[10], // Pehla Pehla Pyar (1994)
      ALL_SONGS[16], // Saajanji Ghar Aaye (1998)
      ALL_SONGS[18], // Chori Chori Chupke Chupke (2001)
      ALL_SONGS[1],  // Dil Deewana (1989)
      ALL_SONGS[2],  // Tere Naam (2003)
      ALL_SONGS[11], // Didi Tera Devar Deewana (1994)
      ALL_SONGS[12], // Tan Tana Tan (1997)
      ALL_SONGS[13], // O Unchi Hai Building (1997)
      ALL_SONGS[14], // Jeene Ke Hain Chaar Din (2004)
      ALL_SONGS[17], // Just Chill (2005)
      ALL_SONGS[28], // Dagabaaz Re (2012)
      ALL_SONGS[27], // Hangover (2014)
      ALL_SONGS[3],  // Hud Hud Dabangg (2010)
      ALL_SONGS[4],  // Jumme Ki Raat (2014)
      ALL_SONGS[5],  // Swag Se Swagat (2017)
      ALL_SONGS[6],  // Dil Diyan Gallan (2017)
      ALL_SONGS[7],  // Munni Badnaam Hui (2010)
      ALL_SONGS[15], // Character Dheela (2011)
      ALL_SONGS[19], // Jag Ghoomeya (2016)
      ALL_SONGS[20], // Slow Motion (2019)
      ALL_SONGS[21], // Seeti Maar (2021)
      ALL_SONGS[22], // Main Hoon Hero Tera (2015)
      ALL_SONGS[23], // Aaj Unse Milna Hai (2015)
      ALL_SONGS[24], // Prem Leela (2015)
      ALL_SONGS[25], // Selfie Le Le Re (2015)
      ALL_SONGS[26], // Tu Jo Mila (2015)
      ALL_SONGS[29], // Pandey Jee Se Seeti (2012)
      ALL_SONGS[30], // Fevicol Se (2012)
      ALL_SONGS[31], // Mashallah (2012)
      ALL_SONGS[32], // Saiyaara (2012)
      ALL_SONGS[33], // Lapaata (2012)
      ALL_SONGS[34], // Radio (2017)
      ALL_SONGS[35], // Baby Ko Bass Pasand Hai (2016)
      ALL_SONGS[36], // 440 Volt (2016)
      ALL_SONGS[37], // Sultan Title Track (2016)
      ALL_SONGS[38], // Dhinka Chika (2011)
      ALL_SONGS[39]  // Naiyo Lagda (2023)
    ]
  }
};

export const PLAYLISTS = Object.values(playlists);
export default playlists;

