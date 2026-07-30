const { spawn } = require('child_process');
const path = require('path');

const os = require('os');

const getLocalIp = () => {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return '192.168.18.184';
};

const localIp = getLocalIp();

console.log('==================================================');
console.log('🚀 TENLEA Application Launching...');
console.log('🌐 Desktop Link: http://localhost:3000');
console.log(`📱 Mobile Link:  http://${localIp}:3000`);
console.log('⚙️  Backend API:  http://localhost:5000');
console.log('==================================================\n');

// Start Express Backend API Server (Port 5000)
const server = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, 'backend'),
  stdio: 'inherit',
  shell: true
});

// Start React Vite Frontend Server (Port 3000)
const frontend = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, 'frontend'),
  stdio: 'inherit',
  shell: true
});

server.on('error', (err) => {
  console.error('[Server Error]:', err);
});

frontend.on('error', (err) => {
  console.error('[Frontend Error]:', err);
});

process.on('SIGINT', () => {
  console.log('\nStopping TENLEA services...');
  server.kill('SIGINT');
  frontend.kill('SIGINT');
  process.exit(0);
});
