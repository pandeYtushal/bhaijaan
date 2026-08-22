// BHAIJAAN.WTF — Spotify PKCE OAuth Authentication & Token Management

const DEFAULT_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID || '';
const REDIRECT_URI = typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}` : 'http://localhost:5173/';
const SCOPES = [
  'streaming',
  'user-read-email',
  'user-read-private',
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing'
].join(' ');

function generateRandomString(length) {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], '');
}

async function generateCodeChallenge(codeVerifier) {
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode.apply(null, new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export const spotifyAuth = {
  getClientId() {
    return localStorage.getItem('bhaijaan_spotify_client_id') || DEFAULT_CLIENT_ID;
  },

  setClientId(id) {
    if (id) {
      localStorage.setItem('bhaijaan_spotify_client_id', id.trim());
    }
  },

  async handleCallback() {
    if (typeof window === 'undefined') return null;

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      const codeVerifier = localStorage.getItem('bhaijaan_code_verifier');
      const clientId = this.getClientId();

      if (codeVerifier && clientId) {
        console.log('[BHAIJAAN] Exchanging auth code for token via PKCE...');
        try {
          const body = new URLSearchParams({
            client_id: clientId,
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: REDIRECT_URI,
            code_verifier: codeVerifier
          });

          const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: body
          });

          if (response.ok) {
            const data = await response.json();
            const accessToken = data.access_token;
            const refreshToken = data.refresh_token;
            const expiresIn = data.expires_in || 3600;

            const expirationTime = Date.now() + (expiresIn * 1000);
            localStorage.setItem('bhaijaan_spotify_token', accessToken);
            if (refreshToken) localStorage.setItem('bhaijaan_spotify_refresh_token', refreshToken);
            localStorage.setItem('bhaijaan_token_expiry', expirationTime.toString());

            console.log('[BHAIJAAN] PKCE Token exchange successful');
            window.history.replaceState({}, document.title, window.location.pathname);
            return accessToken;
          } else {
            console.error('[BHAIJAAN] PKCE Token exchange failed:', response.status);
          }
        } catch (err) {
          console.error('[BHAIJAAN] Network error on PKCE token exchange:', err);
        }
      }
    }

    return this.getValidToken();
  },

  getToken() {
    if (typeof window === 'undefined') return null;

    const savedToken = localStorage.getItem('bhaijaan_spotify_token');
    const expiry = localStorage.getItem('bhaijaan_token_expiry');

    if (savedToken && expiry) {
      if (Date.now() < parseInt(expiry, 10)) {
        return savedToken;
      } else {
        localStorage.removeItem('bhaijaan_spotify_token');
        localStorage.removeItem('bhaijaan_token_expiry');
      }
    } else if (savedToken && !expiry) {
      return savedToken;
    }

    return null;
  },

  async refreshToken() {
    const refreshToken = localStorage.getItem('bhaijaan_spotify_refresh_token');
    const clientId = this.getClientId();
    if (!refreshToken || !clientId) return null;

    try {
      const body = new URLSearchParams({
        client_id: clientId,
        grant_type: 'refresh_token',
        refresh_token: refreshToken
      });

      const res = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body
      });

      if (res.ok) {
        const data = await res.json();
        const newAccessToken = data.access_token;
        const expiresIn = data.expires_in || 3600;
        const expirationTime = Date.now() + (expiresIn * 1000);

        localStorage.setItem('bhaijaan_spotify_token', newAccessToken);
        if (data.refresh_token) {
          localStorage.setItem('bhaijaan_spotify_refresh_token', data.refresh_token);
        }
        localStorage.setItem('bhaijaan_token_expiry', expirationTime.toString());

        console.log('[BHAIJAAN] Access token refreshed successfully via PKCE');
        return newAccessToken;
      }
    } catch (e) {
      console.error('[BHAIJAAN] Failed to refresh token:', e);
    }
    return null;
  },

  async getValidToken() {
    const savedToken = localStorage.getItem('bhaijaan_spotify_token');
    const expiry = localStorage.getItem('bhaijaan_token_expiry');

    if (savedToken && expiry) {
      if (Date.now() + 60000 < parseInt(expiry, 10)) {
        return savedToken;
      }
      const refreshed = await this.refreshToken();
      if (refreshed) return refreshed;
    } else if (savedToken) {
      return savedToken;
    }

    return this.getToken();
  },

  async login(clientIdOverride = null) {
    const clientId = clientIdOverride || this.getClientId();

    if (!clientId) {
      console.warn('[BHAIJAAN] Cannot trigger login: Spotify Client ID is not configured.');
      return false;
    }

    const codeVerifier = generateRandomString(64);
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    localStorage.setItem('bhaijaan_code_verifier', codeVerifier);

    const authUrl = new URL('https://accounts.spotify.com/authorize');
    authUrl.search = new URLSearchParams({
      response_type: 'code',
      client_id: clientId,
      scope: SCOPES,
      code_challenge_method: 'S256',
      code_challenge: codeChallenge,
      redirect_uri: REDIRECT_URI
    }).toString();

    console.log('[BHAIJAAN] Redirecting to Spotify PKCE Login:', authUrl.toString());
    window.location.href = authUrl.toString();
    return true;
  },

  setManualToken(token) {
    if (!token) return;
    const cleanToken = token.trim().replace(/^Bearer\s+/i, '');
    const expirationTime = Date.now() + (3600 * 1000);
    localStorage.setItem('bhaijaan_spotify_token', cleanToken);
    localStorage.setItem('bhaijaan_token_expiry', expirationTime.toString());
    console.log('[BHAIJAAN] Manual Spotify Token set successfully');
  }
};

export default spotifyAuth;
