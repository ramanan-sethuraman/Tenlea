const { initializeApp, cert } = require('firebase-admin/app');
const fs = require('fs');
const path = require('path');

async function updateRules() {
  const key = JSON.parse(fs.readFileSync(path.join(__dirname, 'config/serviceAccountKey.json'), 'utf8'));
  const app = initializeApp({ credential: cert(key), projectId: 'tenlea' }, 'rules_mgr_' + Date.now());
  const token = await app.options.credential.getAccessToken();

  const rulesContent = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}`;

  try {
    console.log('1. Creating new ruleset with open dev rules...');
    const res = await fetch('https://firebaserules.googleapis.com/v1/projects/tenlea/rulesets', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token.access_token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        source: {
          files: [
            {
              name: 'firestore.rules',
              content: rulesContent
            }
          ]
        }
      })
    });
    const data = await res.json();
    console.log('Create Ruleset Result:', JSON.stringify(data, null, 2));

    if (data.name) {
      console.log('2. Releasing ruleset to default database...');
      // List existing releases
      const listRes = await fetch('https://firebaserules.googleapis.com/v1/projects/tenlea/releases', {
        headers: { Authorization: 'Bearer ' + token.access_token }
      });
      const listData = await listRes.json();
      console.log('Existing Releases:', JSON.stringify(listData, null, 2));

      // Try updating each release or creating
      if (listData.releases) {
        for (const rel of listData.releases) {
          const relRes = await fetch(`https://firebaserules.googleapis.com/v1/${rel.name}`, {
            method: 'PATCH',
            headers: {
              Authorization: 'Bearer ' + token.access_token,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              release: {
                name: rel.name,
                rulesetName: data.name
              }
            })
          });
          console.log(`Updated release ${rel.name}:`, await relRes.json());
        }
      } else {
        // Create release cloud.firestore
        const createRelRes = await fetch('https://firebaserules.googleapis.com/v1/projects/tenlea/releases', {
          method: 'POST',
          headers: {
            Authorization: 'Bearer ' + token.access_token,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: 'projects/tenlea/releases/cloud.firestore',
            rulesetName: data.name
          })
        });
        console.log('Created release:', await createRelRes.json());
      }
    }
  } catch (e) {
    console.error('Error updating rules:', e.message);
  }
}

updateRules();
