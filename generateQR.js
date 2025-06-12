const qrcode = require('qrcode');
const ip = require('ip');
const fs = require('fs');
const path = require('path');

function maybeGenerateQR() {
  const currentIp = ip.address();
  const dashboardURL = `http://${currentIp}:8080/dashboard`;

  console.log("📲 Dashboard QR URL:", dashboardURL);

  fs.writeFileSync(path.join(__dirname, 'qr_ip.txt'), `Dashboard: ${dashboardURL}`, 'utf-8');

  // Generate terminal QR as fallback
  require('qrcode-terminal').generate(dashboardURL, { small: true });

  // Generate PNG file
  const outputPath = path.join(__dirname, 'qr.png');
  qrcode.toFile(outputPath, dashboardURL, {
    width: 300,
    errorCorrectionLevel: 'H'
  }, function (err) {
    if (err) console.error('❌ QR PNG error:', err);
    else console.log('✅ qr.png updated at', outputPath);
  });
}

module.exports = { maybeGenerateQR };
