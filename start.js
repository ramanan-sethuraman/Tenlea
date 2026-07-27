const { spawn } = require('child_process');
const path = require('path');

console.log('==================================================');
console.log('🚀 TENLEA Application Launching...');
console.log('🌐 Frontend App: http://localhost:3000');
console.log('⚙️  Backend API:  http://localhost:5000');
console.log('==================================================\n');

// Start Express Backend API Server (Port 5000)
const server = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, 'server'),
  stdio: 'inherit',
  shell: true
});

// Start React Vite Frontend Server (Port 3000)
const client = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, 'client'),
  stdio: 'inherit',
  shell: true
});

server.on('error', (err) => {
  console.error('[Server Error]:', err);
});

client.on('error', (err) => {
  console.error('[Client Error]:', err);
});

process.on('SIGINT', () => {
  console.log('\nStopping TENLEA services...');
  server.kill('SIGINT');
  client.kill('SIGINT');
  process.exit(0);
});
