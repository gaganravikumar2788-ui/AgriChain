import localtunnel from 'localtunnel';

async function startTunnel() {
  try {
    const tunnel = await localtunnel({
      port: 5173,
      subdomain: 'agrichain-demo-live'
    });

    console.log('\n======================================================');
    console.log('🚀 AGRICHAIN LIVE PUBLIC SHAREABLE URL:');
    console.log(tunnel.url);
    console.log('======================================================\n');

    tunnel.on('close', () => {
      console.log('Tunnel closed, reconnecting in 3s...');
      setTimeout(startTunnel, 3000);
    });

    tunnel.on('error', (err) => {
      console.error('Tunnel error:', err.message);
      setTimeout(startTunnel, 3000);
    });
  } catch (err) {
    console.error('Tunnel startup error:', err.message);
    setTimeout(startTunnel, 3000);
  }
}

// Keep node event loop alive indefinitely
setInterval(() => {}, 1000 * 60);

startTunnel();
