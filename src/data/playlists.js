// BHAIJAAN.WTF — Official Spotify Playlist Configurations with Default Initial Songs

export const playlists = {
  bhaiMode: {
    id: "bhai-mode",
    name: "BHAI MODE",
    label: "BHAI MODE",
    spotifyUrl: "https://open.spotify.com/playlist/3Ye57MhrB2yFkD39bdxU5c",
    subtitle: "Spotify · Salman Khan Bangers",
    initialTrack: {
      title: "O O Jaane Jaana",
      film: "Pyaar Kiya To Darna Kya",
      year: 1998,
      singers: ["Kamal Khan"]
    }
  },

  bhaiOfficial: {
    id: "bhai-official",
    name: "BHAI OFFICIAL",
    label: "BHAI OFFICIAL",
    spotifyUrl: "https://open.spotify.com/playlist/37i9dQZF1DZ06evO3CjygN",
    subtitle: "Spotify · Official Flagship",
    initialTrack: {
      title: "Dil Diyan Gallan",
      film: "Tiger Zinda Hai",
      year: 2017,
      singers: ["Atif Aslam"]
    }
  },

  twoThousands: {
    id: "2000s-kid",
    name: "2000s KID",
    label: "2000s KID",
    spotifyUrl: "https://open.spotify.com/playlist/7iW35WA5Zs6GtHBGGRu4CZ",
    subtitle: "Spotify · Love & Heartbreak",
    initialTrack: {
      title: "Tere Naam",
      film: "Tere Naam",
      year: 2003,
      singers: ["Udit Narayan"]
    }
  },

  nineties: {
    id: "90s-radio",
    name: "90s RADIO",
    label: "90s RADIO",
    spotifyUrl: "https://open.spotify.com/playlist/4a499zchFELXUSumfrUFvK",
    subtitle: "Spotify · Blockbuster 90s Hits",
    initialTrack: {
      title: "Dil Deewana",
      film: "Maine Pyar Kiya",
      year: 1989,
      singers: ["S.P. Balasubrahmanyam"]
    }
  },

  nostalgia: {
    id: "nostalgia",
    name: "90s / EARLY 2000s",
    label: "90s / EARLY 2000s",
    spotifyUrl: "https://open.spotify.com/playlist/0Rgj9nRineoSYEktQeg61b",
    subtitle: "Spotify · Cult Nostalgia",
    initialTrack: {
      title: "Chand Chhupa Badal Mein",
      film: "Hum Dil De Chuke Sanam",
      year: 1999,
      singers: ["Udit Narayan", "Alka Yagnik"]
    }
  }
};

export const PLAYLISTS = Object.values(playlists);
export default playlists;
