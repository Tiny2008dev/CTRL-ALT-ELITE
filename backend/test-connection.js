const net = require('net');

const host = 'cluster0-shard-00-00.3p3rjma.mongodb.net';
const port = 27017;

const socket = net.createConnection(port, host);

socket.on('connect', () => {
  console.log('✅ Can reach MongoDB server!');
  socket.end();
});

socket.on('error', (err) => {
  console.log('❌ Cannot reach MongoDB:', err.message);
});

socket.setTimeout(5000, () => {
  console.log('❌ Connection timeout');
  socket.destroy();
});