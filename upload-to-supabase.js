// Script to upload Sprout images to Supabase Storage
const fs = require('fs');
const path = require('path');
const https = require('https');

// Supabase configuration
const SUPABASE_URL = 'https://fuznyncrufagipokvrub.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1em55bmNydWZhZ2lwb2t2cnViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzODg4OTksImV4cCI6MjA2ODk2NDg5OX0.TPxXKY5cEOSzKP1SEDK9wwpHzyymJhqsjdoSmiqXrqs';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1em55bmNydWZhZ2lwb2t2cnViIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzM4ODg5OSwiZXhwIjoyMDY4OTY0ODk5fQ.M_Rorc9fgiVp9BdRnc-NSjZxmRBEQyXnL9jaPD5fwhU';
// S3-style credentials (for future use if needed)
const S3_ACCESS_KEY_ID = '3f19e95675e1c7815c371ebc8a257792';
const S3_SECRET_ACCESS_KEY = '64eee7e83cff41221980c83c634894aba423d0363a8a91bcdb083a7e58d3b9ae';

// Image files to upload
const IMAGES_DIR = '/Users/arambarnett/Vanimals/Vanimals/sprouts_characters';
const SPECIES = ['bear', 'deer', 'fox', 'owl', 'penguin', 'rabbit'];

// Upload function
async function uploadToSupabase(filePath, destinationPath) {
  return new Promise((resolve, reject) => {
    const fileBuffer = fs.readFileSync(filePath);
    const fileName = path.basename(destinationPath);

    const options = {
      hostname: 'fuznyncrufagipokvrub.supabase.co',
      port: 443,
      path: `/storage/v1/object/sprouts/${destinationPath}`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'image/png',
        'Content-Length': fileBuffer.length,
        'x-upsert': 'true' // Overwrite if exists
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200 || res.statusCode === 201) {
          console.log(`✅ Uploaded: ${destinationPath}`);
          resolve(data);
        } else {
          console.error(`❌ Failed to upload ${destinationPath}: ${res.statusCode}`);
          console.error(`Response: ${data}`);
          reject(new Error(`Upload failed: ${res.statusCode}`));
        }
      });
    });

    req.on('error', (error) => {
      console.error(`❌ Error uploading ${destinationPath}:`, error);
      reject(error);
    });

    req.write(fileBuffer);
    req.end();
  });
}

// Main upload process
async function main() {
  console.log('🚀 Starting Supabase upload...\n');

  // For each species, upload egg and sprout stages
  for (const species of SPECIES) {
    const sourceFile = path.join(IMAGES_DIR, `${species}.png`);

    if (!fs.existsSync(sourceFile)) {
      console.error(`⚠️  File not found: ${sourceFile}`);
      continue;
    }

    try {
      // Upload as egg (all species use same image for now)
      await uploadToSupabase(sourceFile, `${species}_Egg_Common.png`);
      await new Promise(resolve => setTimeout(resolve, 500)); // Rate limit delay

      // Upload as sprout (Common rarity)
      await uploadToSupabase(sourceFile, `${species}_Sprout_Common.png`);
      await new Promise(resolve => setTimeout(resolve, 500)); // Rate limit delay

    } catch (error) {
      console.error(`Failed to upload ${species}:`, error.message);
    }
  }

  console.log('\n✅ Upload complete!');
  console.log('\nTest URLs:');
  SPECIES.forEach(species => {
    console.log(`https://fuznyncrufagipokvrub.supabase.co/storage/v1/object/public/sprouts/${species}_Sprout_Common.png`);
  });
}

main().catch(console.error);
