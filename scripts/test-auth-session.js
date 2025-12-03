/**
 * Test Auth Session Endpoint
 * 
 * Usage: node scripts/test-auth-session.js
 * 
 * Tests the /api/auth/session endpoint and decodes the JWT token
 */

const http = require('http');
const jwt = require('jsonwebtoken');

const PORT = process.env.PORT || 3000;
const SESSION_KEY = process.env.SESSION_KEY || 'test';

const url = `http://localhost:${PORT}/api/auth/session?sessionKey=${SESSION_KEY}`;

console.log(`\n🧪 Testing Auth Session Endpoint`);
console.log(`📍 URL: ${url}\n`);

const req = http.get(url, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log(`📊 HTTP Status: ${res.statusCode} ${res.statusMessage}\n`);

    if (res.statusCode !== 200) {
      console.error('❌ Request failed');
      try {
        const error = JSON.parse(data);
        console.error('Error:', error);
      } catch (e) {
        console.error('Response:', data);
      }
      process.exit(1);
    }

    try {
      const response = JSON.parse(data);
      console.log('✅ Response Body:');
      console.log(JSON.stringify(response, null, 2));
      console.log('\n');

      // Decode JWT token
      if (response.supabaseAccessToken) {
        console.log('🔐 Decoded JWT Payload:');
        // Decode without verification (just to see the payload)
        const decoded = jwt.decode(response.supabaseAccessToken, { complete: true });
        
        if (decoded && decoded.payload) {
          const payload = decoded.payload;
          console.log(JSON.stringify({
            sub: payload.sub,
            agency_id: payload.agency_id,
            location_id: payload.location_id,
            role: payload.role,
            app_role: payload.app_role,
            email: payload.email,
            name: payload.name,
            exp: payload.exp,
            iat: payload.iat,
          }, null, 2));
          
          // Show expiration info
          if (payload.exp) {
            const expiresAt = new Date(payload.exp * 1000);
            const now = new Date();
            const expiresIn = Math.floor((payload.exp * 1000 - now.getTime()) / 1000 / 60);
            console.log(`\n⏰ Token expires: ${expiresAt.toISOString()} (in ${expiresIn} minutes)`);
          }
        } else {
          console.log('⚠️  Could not decode JWT payload');
        }
      } else {
        console.log('⚠️  No supabaseAccessToken in response');
      }
    } catch (error) {
      console.error('❌ Failed to parse response:', error.message);
      console.error('Raw response:', data);
      process.exit(1);
    }
  });
});

req.on('error', (error) => {
  console.error(`❌ Request error: ${error.message}`);
  console.error('\n💡 Make sure the dev server is running on port', PORT);
  process.exit(1);
});

req.setTimeout(10000, () => {
  console.error('❌ Request timeout');
  req.destroy();
  process.exit(1);
});

