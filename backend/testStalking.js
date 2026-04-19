const axios = require('axios');

const API_URL = process.env.API_URL || 'http://localhost:5000/api/classify';

const TEST_CASE = {
  name: 'Simple Stalking Report',
  input: 'A man keeps following me and calling me even after I told him to stop.',
  expected: 'IPC 354D'
};

async function runTest() {
  console.log('\n🔎 Running Stalking Test - Expecting IPC 354D\n');

  try {
    const resp = await axios.post(API_URL, { text: TEST_CASE.input });
    const data = resp.data;
    const items = data.results || data.sections || [];

    if (data.success && items.length > 0) {
      const codes = items.map(s => s.code);
      console.log('Found section codes:', codes.join(', '));

      if (codes.includes(TEST_CASE.expected)) {
        console.log('✅ PASS - IPC 354D detected');
        process.exit(0);
      } else {
        console.error('❌ FAIL - Expected IPC 354D but not found');
        process.exit(2);
      }
    } else {
      console.error('❌ FAIL - No sections returned');
      console.error('Response:', JSON.stringify(data, null, 2));
      process.exit(2);
    }
  } catch (err) {
    if (err.code === 'ECONNREFUSED') {
      console.error('❌ ERROR - API server not reachable (ECONNREFUSED)');
    } else {
      console.error('❌ ERROR -', err.message);
    }
    process.exit(3);
  }
}

runTest();
