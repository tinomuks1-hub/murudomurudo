const pool = require('../config/db');

const getProfile = async (req, res) => {
  try {
    const user = await pool.query(
      'SELECT id, name, email, university, major, year, bio, profile_photo FROM users WHERE id = $1',
      [req.user.id]
    );
    if (user.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateProfile = async (req, res) => {
  const { name, university, major, year, bio } = req.body;
  try {
    const updated = await pool.query(
      `UPDATE users SET name=$1, university=$2, major=$3, year=$4, bio=$5 WHERE id=$6 RETURNING id, name, email, university, major, year, bio`,
      [name, university, major, year, bio, req.user.id]
    );
    res.json(updated.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await pool.query(
      'SELECT id, name, university, major, year, bio, profile_photo FROM users WHERE id != $1',
      [req.user.id]
    );
    res.json(users.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getProfile, updateProfile, getUsers };