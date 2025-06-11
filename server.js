const express = require('express');
const fs = require('fs');
const path = require('path');
const ip = require('ip');
const qrcode = require('qrcode-terminal');
const app = express();
const port = 8080;

const settingsPath = path.join(__dirname, 'settings.json');
const remindersPath = path.join('C:/Photos', 'reminders.txt');

if (!fs.existsSync(settingsPath)) fs.writeFileSync(settingsPath, JSON.stringify({ showQR: true, qrPosition: "bottom-right" }, null, 2));
if (!fs.existsSync(remindersPath)) fs.writeFileSync(remindersPath, "Move your limbs now");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'dashboard.html'));
});

// Settings
app.get('/settings', (req, res) => {
  try {
    const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf-8'));
    res.json(settings);
  } catch {
    res.status(500).json({ error: 'Could not load settings' });
  }
});

app.post('/settings', (req, res) => {
  const showQR = req.body.showQR === true || req.body.showQR === "true" || req.body.showQR === "on";
  const { qrPosition } = req.body;
  fs.writeFileSync(settingsPath, JSON.stringify({ showQR, qrPosition }, null, 2));
  res.json({ success: true });
});

// Reminders
app.get('/reminders', (req, res) => {
  try {
    const lines = fs.readFileSync(remindersPath, 'utf-8').split('\n').filter(Boolean);
    res.json({ reminders: lines });
  } catch {
    res.status(500).json({ error: 'Could not load reminders' });
  }
});

app.post('/reminders', (req, res) => {
  const { reminders } = req.body;
  fs.writeFileSync(remindersPath, reminders.join('\n'));
  res.json({ success: true });
});

app.get('/ip', (req, res) => {
  res.json({ url: `http://${ip.address()}:${port}/dashboard` });
});

app.listen(port, () => {
  const dashboardUrl = `http://${ip.address()}:${port}/dashboard`;
  console.log(`Dashboard available at ${dashboardUrl}`);
  qrcode.generate(dashboardUrl, { small: true });
});