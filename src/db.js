const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./ips.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS rooms (
      name TEXT UNIQUE,
      password TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT UNIQUE,
      room_id TEXT NOT NULL,
      ip TEXT,
      FOREIGN KEY (room_id) REFERENCES rooms(name) ON DELETE CASCADE
    )
  `);
});

function createRoom({name, password}, callback) {
  db.run(
    'INSERT INTO rooms (name, password) VALUES (?, ?)',
    [name, password],
    function(err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          callback(null, 'A room with this name already exists.');
        } else {
          callback(err);
        }
      } else {
        callback(null, `Room "${name}" was successfully created with the name "${name}"`);
      }
    }
  );
}

function getRoom(name, callback) {
  db.get(
    'SELECT * FROM rooms WHERE name = ?',
    [name],
    (err, room) => {
      if (err) return callback(err);
      if (!room) return callback(null, null);
      
      db.all(
        'SELECT * FROM users WHERE room_id = ?',
        [name],
        (err, users) => {
          if (err) return callback(err);
          room.users = users;
          callback(null, room);
        }
      );
    }
  );
}

function deleteRoom(name, callback) {
  db.run(
    'DELETE FROM rooms WHERE name = ?',
    [name],
    function(err) {
      if (err) {
        callback(err);
      } else {
        callback(null, this.changes > 0 
          ? `Room "${name}" has been deleted.` 
          : 'The requested room could not be found.');
      }
    }
  );
}

function addUser({ id, room_id, ip }, callback) {
  db.run(
    'INSERT INTO users (id, room_id, ip) VALUES (?, ?, ?)',
    [id, room_id, ip],
    function(err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          callback(null, 'A user with this IP is already in the room.');
        } else if (err.message.includes('FOREIGN KEY constraint failed')) {
          callback(null, 'The room could not be found.  ');
        } else {
          callback(err);
        }
      } else {
        callback(null, `User ${id} has been added to room ${room_id}.`);
      }
    }
  );
}

function removeUser(userId, callback) {
  db.run(
    'DELETE FROM users WHERE id = ?',
    [userId],
    function(err) {
      if (err) {
        callback(err);
      } else {
        callback(null, this.changes > 0
          ? `User ${userId} has been deleted.`
          : 'The user could not be found.');
      }
    }
  );
  
}

function getRoomUsers(name, callback) {
  db.all(
    'SELECT * FROM users WHERE room_id = ?',
    [name],
    (err, users) => {
      if (err) callback(err);
      else callback(null, users);
    }
  );
}

module.exports = {
  createRoom,
  getRoom,
  deleteRoom,
  addUser,
  removeUser,
  getRoomUsers
};