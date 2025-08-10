const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const FILE = path.join(DATA_DIR, 'bookings.json');

async function ensureFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try { await fs.access(FILE); }
  catch { await fs.writeFile(FILE, '[]', 'utf-8'); }
}

async function readBookings() {
  await ensureFile();
  const raw = await fs.readFile(FILE, 'utf-8');
  try { return JSON.parse(raw); } catch { return []; }
}

async function writeBookings(list) {
  await ensureFile();
  await fs.writeFile(FILE, JSON.stringify(list, null, 2), 'utf-8');
}

async function addBooking(booking) {
  const list = await readBookings();
  list.push(booking);
  await writeBookings(list);
  return booking;
}

module.exports = { readBookings, addBooking };
