/**
 * Session Key Extractor
 * Robustly extracts sessionKey from URL, handling both query params and hash routing
 */

/**
 * Extract sessionKey from URL
 * 
 * Looks for sessionKey or session_key in:
 * 1. Standard query params (window.location.search)
 * 2. Hash-based query params (after # in window.location.hash)
 * 
 * @returns The session key if found, null otherwise
 */
export function extractSessionKey(): string | null {
  // Method 1: Check standard query params
  const searchParams = new URLSearchParams(window.location.search);
  const sessionKeyFromSearch = searchParams.get('sessionKey') || searchParams.get('session_key');
  if (sessionKeyFromSearch) {
    return sessionKeyFromSearch;
  }

  // Method 2: Check hash-based query params
  // Example: #/dashboard?sessionKey=123
  const hash = window.location.hash;
  if (hash && hash.includes('?')) {
    const hashParts = hash.split('?');
    if (hashParts.length > 1) {
      const hashParams = new URLSearchParams(hashParts[1]);
      const sessionKeyFromHash = hashParams.get('sessionKey') || hashParams.get('session_key');
      if (sessionKeyFromHash) {
        return sessionKeyFromHash;
      }
    }
  }

  // Method 3: Regex fallback - search entire href
  const href = window.location.href;
  const sessionKeyMatch = href.match(/[?&#](?:sessionKey|session_key)=([^&#]+)/i);
  if (sessionKeyMatch && sessionKeyMatch[1]) {
    return decodeURIComponent(sessionKeyMatch[1]);
  }

  return null;
}

/**
 * Remove sessionKey from URL without breaking hash routing
 * 
 * @param sessionKey - The session key to remove
 */
export function removeSessionKeyFromUrl(sessionKey: string): void {
  const url = new URL(window.location.href);
  const hash = window.location.hash;

  // Remove from search params
  url.searchParams.delete('sessionKey');
  url.searchParams.delete('session_key');

  // Remove from hash if present
  let newHash = hash;
  if (hash && hash.includes('?')) {
    const hashParts = hash.split('?');
    const hashPath = hashParts[0];
    const hashParams = new URLSearchParams(hashParts[1] || '');
    
    hashParams.delete('sessionKey');
    hashParams.delete('session_key');

    const remainingParams = hashParams.toString();
    newHash = remainingParams ? `${hashPath}?${remainingParams}` : hashPath;
  }

  // Rebuild URL
  const newUrl = url.pathname + url.search + newHash;
  window.history.replaceState({}, '', newUrl);
}

