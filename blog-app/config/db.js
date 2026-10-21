// Tiny JSON-file database so the project runs with zero external setup.
// Swap this module for MongoDB/MySQL later without touching the routes' logic much.
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

function filePath(name) {
  return path.join(DATA_DIR, `${name}.json`);
}

function readAll(name) {
  const file = filePath(name);
  if (!fs.existsSync(file)) return [];
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8') || '[]');
  } catch {
    return [];
  }
}

function writeAll(name, rows) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const tmp = filePath(name) + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(rows, null, 2));
  fs.renameSync(tmp, filePath(name)); // atomic write
}

function nextId(rows) {
  return rows.length ? Math.max(...rows.map((r) => r.id)) + 1 : 1;
}

module.exports = { readAll, writeAll, nextId };
