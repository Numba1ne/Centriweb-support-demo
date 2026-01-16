/**
 * GoHighLevel (GHL) Session Validation
 * Validates GHL Marketplace session keys via API or mock mode
 */

export interface GhlSessionData {
  companyId: string;
  activeLocation: string | null;
  userId: string;
  role: 'admin' | 'user';
  type: 'location' | 'agency';
  email?: string;
  name?: string;
}

/**
 * Validate a GHL session key
 * 
 * In mock mode (MOCK_GHL_SESSION=true), returns hardcoded data.
 * Otherwise, calls GHL v2 API validation endpoint.
 * 
 * @param sessionKey - The GHL session key from query params
 * @returns Validated session data
 */
export async function validateGhlSession(sessionKey: string): Promise<GhlSessionData> {
  const isMock = process.env.MOCK_GHL_SESSION === 'true';

  if (isMock) {
    // Mock mode: return hardcoded data
    return {
      companyId: 'mock-company-123',
      activeLocation: 'mock-location-456',
      userId: 'mock-user-789',
      role: 'admin',
      type: 'location',
      email: 'admin@example.com',
      name: 'Mock Admin User',
    };
  }

  // Real mode: call GHL v2 API validation endpoint
  const ghlApiKey = process.env.GHL_API_KEY;
  const ghlApiUrl = process.env.GHL_API_URL || 'https://api.gohighlevel.com/v2';

  if (!ghlApiKey) {
    throw new Error('GHL_API_KEY environment variable is not set');
  }

  try {
    const response = await fetch(`${ghlApiUrl}/marketplace/sso/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ghlApiKey}`,
      },
      body: JSON.stringify({ sessionKey }),
    });

    if (!response.ok) {
      throw new Error(`GHL API returned ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    // Transform GHL API response to our format
    // NOTE: Adjust these field mappings based on actual GHL API response structure
    return {
      companyId: data.companyId || data.company_id || data.location?.companyId,
      activeLocation: data.activeLocation || data.active_location || data.location?.id || null,
      userId: data.userId || data.user_id || data.user?.id,
      role: (data.role === 'admin' || data.role === 'user') ? data.role : 'user',
      type: (data.type === 'location' || data.type === 'agency') ? data.type : 'location',
      email: data.email || data.user?.email,
      name: data.name || data.user?.name,
    };
  } catch (error) {
    console.error('[GHL] Session validation error:', error);
    throw new Error('Failed to validate GHL session');
  }
}

